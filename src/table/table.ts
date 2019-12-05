import {Subject} from "../interfaces/interfaces";
import {TableView} from "./table-view";
import {SortModel} from "./sort-model";
import {sortFunc} from "../utils/sort-func";

export class Table implements Subject {
    private observers: Array<any> = [];
    private view: TableView;
    private data: [];
    private visibleData: Array<any>;
    private headerModel: object;
    private sortingModel: SortModel;
    public sortedData: any[];

    constructor(view: TableView) {
        this.view = view;
        this.sortingModel = new SortModel();
        document.querySelector(this.view.selector).addEventListener('click', this.clickEventHandler);
    }

    updateData(headerModel, body) {
        this.headerModel = headerModel;
        this.visibleData = body;
        this.show();
    }

    updateOriginalData(data) {
        this.data = data;
        this.sortedData = [...data];
        this.sortingModel.prop = '';
    }

    clickEventHandler = (e) => {
        e.stopPropagation();
        if (e.target.closest('thead') && e.target.dataset["property"]) {
            let elem = e.target;
            this.setSortingModel(elem.dataset["property"]);
            this.sort();
            this.notify();
        }
    };

    attach(observer: any): void {
        this.observers.push(observer);
    }

    setSortingModel(key) {
        if (key !== this.sortingModel.prop) {
            this.sortingModel.prop = key;
            this.sortingModel.direction = 'desc';
        } else {
            this.switchSortDirection()
        }
    }

    switchSortDirection() {
        if (!this.sortingModel.direction) {
            this.sortingModel.direction = 'desc';
        } else if (this.sortingModel.direction === 'desc') {
            this.sortingModel.direction = 'asc'
        } else {
            this.sortingModel.direction = null;
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
        if (this.sortingModel.direction) {
            this.sortedData.sort(sortFunc(this.sortingModel.prop, this.sortingModel.direction));
        }
        if (this.sortingModel.direction === null) {
            this.sortedData = [...this.data];
        }
    }

    show(): void {
        this.view.render(this.headerModel, this.visibleData, this.sortingModel);
    }
}
