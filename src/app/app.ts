import {Paginator} from "../pagination/pagination";
import {Table} from "../table/table";
import {Filter} from "../filter/filter";
import {PaginationView} from "../pagination/pagination-view";
import {TableView} from "../table/table-view";
import {FilterView} from "../filter/filter-view";
import {FilterModeIItem} from "../filter/filter-mode-iItem";
import {HeaderModeIItem} from "../table/header-mode-iItem";
import {simulateAsyncRequest} from "../helpers/simulate-async-request";

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
        simulateAsyncRequest().then(json=>{
            this.filter = new Filter(new FilterView('.filter'));
            this.filter.initialize(json, filterModel);
            this.filter.attach(this.filterHandler.bind(this));

            this.paginator = new Paginator(new PaginationView('.paginator'));
            this.paginator.initialize(json);
            this.paginator.attach(this.paginationHandler.bind(this));

            this.table = new Table(new TableView('.table'));
            this.table.attach(this.tableHandler.bind(this));
            this.table.initialize(headerModel, this.paginator.currentPageData, json);
        });
    }

    paginationHandler(currentPageData: any): void {
        this.table.initialize(headerModel, currentPageData)
    }

    tableHandler(data: any): void {
        this.paginator.initialize(data);
        this.table.initialize(headerModel, this.paginator.currentPageData);
    }

    filterHandler(data: any): void {
        this.paginator.initialize(data);
        this.table.initialize(headerModel, this.paginator.currentPageData, data);
    }
}
