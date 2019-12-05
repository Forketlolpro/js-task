import {PaginationView, Subject} from "../interfaces/interfaces";
import {PaginationViewParam} from "./pagination-view-param";

export class Paginator implements Subject {
    public currentPageData: any[];
    private data: any[];
    private observers: Array<any> = [];
    private currentPage: number;
    private viewParam: PaginationViewParam;
    private view: PaginationView;

    constructor(view: PaginationView) {
        this.view = view;
        this.viewParam = new PaginationViewParam();
        this.viewParam.itemsOnPage = 10;
        document.querySelector(this.view.selector).addEventListener('change', this.changeEventHandler);
        document.querySelector(this.view.selector).addEventListener('click', this.clickEventHandler);
    }

    initialize(data): void {
        this.data = data;
        this.viewParam.pagesTotal = Math.ceil(this.data.length / this.viewParam.itemsOnPage);
        this.viewParam.currentPage = 1;
        this.viewParam.itemCount = data.lenght;
        this.takeCurrentPageElement();
        this.view.render(this.viewParam);
    }

    private changeEventHandler = (e) => {
        this.viewParam.itemsOnPage = e.target.value;
        this.viewParam.pagesTotal = Math.ceil(this.data.length / this.viewParam.itemsOnPage);
        this.viewParam.currentPage = 1;
        this.takeCurrentPageElement();
        this.view.render(this.viewParam);
        this.notify();
    };

    private clickEventHandler = (e: any) => {
        e.stopPropagation();
        if (!e.target.closest('.number') || e.target.className) {
            return false;
        }
        this.viewParam.currentPage = +e.target.innerHTML;
        this.takeCurrentPageElement();
        this.view.render(this.viewParam);
        this.notify();
    };

    private takeCurrentPageElement() {
        this.currentPageData = this.data.slice((this.viewParam.currentPage - 1) * this.viewParam.itemsOnPage, (this.viewParam.currentPage) * this.viewParam.itemsOnPage);
    }

    attach(observer: any): void {
        this.observers.push(observer);
    }

    detach(observer: any): void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex, 1);
    }

    notify(): void {
        for (const observer of this.observers) {
            observer(this.currentPageData);
        }
    }
}
