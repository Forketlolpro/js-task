import {Paginator} from "../pagination/pagination";
import {Table} from "../table/table";
import {Filter} from "../filter/filter";
import {DefaultTableView} from "../table/table-view";
import {DefaultFilterView} from "../filter/filter-view";
import {FilterModelItem} from "../filter/filter-model-item";
import {HeaderModelItem} from "../table/header-model-item";
import {simulateAsyncRequest} from "../utils/simulate-async-request";
import {ReportItem} from "../utils/report-item";
import {DefaultPaginationView} from "../pagination/pagination-view";

let headerModel = {
    image: new HeaderModelItem('', false),
    displayName: new HeaderModelItem('Title', false),
    displays: new HeaderModelItem('Displays', true),
    orders: new HeaderModelItem('Purchase', true),
    clicks: new HeaderModelItem('Clicks', true),
    abandonedUnits: new HeaderModelItem('Abandoned Units', true),
    soldUnits: new HeaderModelItem('Sold units', true),
    revenue: new HeaderModelItem('Revenue', true),
    profit: new HeaderModelItem('Profit', true)
};

let filterModel = {
    displays: new FilterModelItem('Displays'),
    orders: new FilterModelItem('Purchases'),
    clicks: new FilterModelItem('Clicks '),
    abandonedUnits: new FilterModelItem('Abandoned Units'),
    soldUnits: new FilterModelItem('Sold units'),
    revenue: new FilterModelItem('Revenue'),
    profit: new FilterModelItem('Profit')
};

export class App {
    private paginator: Paginator;
    private table: Table;
    private filter: Filter;

    constructor() {
        simulateAsyncRequest().then((json: ReportItem) => {
            this.filter = new Filter(new DefaultFilterView('.filter'));
            this.filter.initialize(json, filterModel);
            this.filter.attach(this.filterHandler);

            this.paginator = new Paginator(new DefaultPaginationView('.paginator'));
            this.paginator.initialize(json);
            this.paginator.attach(this.paginationHandler);

            this.table = new Table(new DefaultTableView('.table'));
            this.table.attach(this.tableHandler);
            this.table.updateOriginalData(json);
            this.table.updateData(headerModel, this.paginator.currentPageData);
        });
    }

    paginationHandler = (currentPageData: any): void => {
        this.table.updateData(headerModel, currentPageData)
    };

    tableHandler = (data: ReportItem): void => {
        this.paginator.initialize(data);
        this.table.updateData(headerModel, this.paginator.currentPageData);
    };

    filterHandler = (data: ReportItem): void => {
        this.paginator.initialize(data);
        this.table.updateOriginalData(data);
        this.table.updateData(headerModel, this.paginator.currentPageData);
    }
}
