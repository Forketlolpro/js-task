import {Paginator} from "../pagination/pagination";
import {Table} from "../table/table";
import {Filter} from "../filter/filter";
import {DefaultTableView} from "../table/table-view";
import {DefaultFilterView} from "../filter/filter-view";
import {FilterModeIItem} from "../filter/filter-mode-iItem";
import {HeaderModeIItem} from "../table/header-mode-iItem";
import {simulateAsyncRequest} from "../utils/simulate-async-request";
import {ReportItem} from "../utils/report-item";
import {DefaultPaginationView} from "../pagination/pagination-view";

let headerModel = {
    image: new HeaderModeIItem('', false),
    displayName: new HeaderModeIItem('Title', false),
    displays: new HeaderModeIItem('Displays', true),
    orders: new HeaderModeIItem('Purchase', true),
    clicks: new HeaderModeIItem('Clicks', true),
    abandonedUnits: new HeaderModeIItem('Abandoned Units', true),
    soldUnits: new HeaderModeIItem('Sold units', true),
    revenue: new HeaderModeIItem('Revenue', true),
    profit: new HeaderModeIItem('Profit', true)
};

let filterModel = {
    displays: new FilterModeIItem('Displays'),
    orders: new FilterModeIItem('Purchases'),
    clicks: new FilterModeIItem('Clicks '),
    abandonedUnits: new FilterModeIItem('Abandoned Units'),
    soldUnits: new FilterModeIItem('Sold units'),
    revenue: new FilterModeIItem('Revenue'),
    profit: new FilterModeIItem('Profit')
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
