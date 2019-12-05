import {Subject} from "../interfaces/interfaces";
import {PaginationView} from "./pagination-view";

export class Paginator implements Subject {
    public currentPageData: any[];
    private data: any[];
    private observers: Array<any> = [];
    private itemsOnPage = 10;
    private currentPage: number;
    private pagesTotal: number;
    private view: PaginationView;

    constructor(view: PaginationView) {
        this.view = view;
        document.querySelector(this.view.selector).addEventListener('change', this.changeEventHandler);
        document.querySelector(this.view.selector).addEventListener('click', this.clickEventHandler);
    }

    initialize(data): void {
        this.data = data;
        this.pagesTotal = Math.ceil(this.data.length / this.itemsOnPage);
        this.currentPage = 1;
        this.takeCurrentPageElement();
        this.view.render(this.currentPage, this.pagesTotal, this.itemsOnPage, this.data.length);
    }

    private changeEventHandler = (e) => {
        this.itemsOnPage = e.target.value;
        this.pagesTotal = Math.ceil(this.data.length / this.itemsOnPage);
        this.currentPage = 1;
        this.takeCurrentPageElement();
        this.view.render(this.currentPage, this.pagesTotal, this.itemsOnPage, this.data.length);
        this.notify();
    };

    private clickEventHandler = (e: any) => {
        e.stopPropagation();
        if (!e.target.closest('.number') || e.target.className) {
            return false;
        }
        this.currentPage = +e.target.innerHTML;
        this.takeCurrentPageElement();
        this.view.render(this.currentPage, this.pagesTotal, this.itemsOnPage, this.data.length);
        this.notify();
    };

    private takeCurrentPageElement() {
        this.currentPageData = this.data.slice((this.currentPage - 1) * this.itemsOnPage, (this.currentPage) * this.itemsOnPage);
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
