import {Subject} from "../interfaces/interfaces";
import {TableView} from "./table-view";
import {SortingModel} from "./sorting-model";

export class Table implements Subject {
    private observers: Array<any> = [];
    private view: TableView;
    private data: [];
    private visibleData: Array<any>;
    private headerModel: object;
    private sortingModel: SortingModel;
    public sortedData: any[];

    constructor(view: TableView) {
        this.view = view;
        this.sortingModel = new SortingModel();
        document.querySelector(this.view.selector).addEventListener('click', this.clickEventHandler.bind(this));
    }

    initialize(headerModel, body, ...args) {
        if (args.length > 0) {
            this.data = args[0];
            this.sortedData = [...args[0]];
            this.sortingModel.key = '';
        }
        this.headerModel = headerModel;
        this.visibleData = body;
        this.show();
    }

    clickEventHandler(e) {
        e.stopPropagation();
        if (e.target.closest('thead') && e.target.dataset["property"]) {
            let elem = e.target;
            this.setSortingModel(elem.dataset["property"]);
            this.sort();
            this.notify();
        }
    }

    attach(observer: any): void {
        this.observers.push(observer);
    }

    setSortingModel(key) {
        if (key !== this.sortingModel.key) {
            this.sortingModel.key = key;
            this.sortingModel.direction = 'desc';
        } else {
            this.sortingModel.direction = (this.sortingModel.direction === 'desc') ? 'asc' : (this.sortingModel.direction === 'asc') ? 'origin' : 'desc';
        }
    }

    detach(observer: any): void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex, 1);
    }

    notify(): void {
        for (const observer of this.observers) {
            observer(this.sortedData);
        }
    }

    sort() {
        if (this.sortingModel.direction === 'desc') {
            this.sortedData.sort(this.sortingModel.descCallback.bind(this));
        }

        if (this.sortingModel.direction === 'asc') {
            this.sortedData.sort(this.sortingModel.ascCallback.bind(this));
        }
        if (this.sortingModel.direction === 'origin') {
            this.sortedData = [...this.data];
        }
    }

    show(): void {
        this.view.render(this.headerModel, this.visibleData, this.sortingModel);
    }
}
