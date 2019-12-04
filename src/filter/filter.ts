import {Subject} from "../interfaces/interfaces";
import {FilterView} from "./filter-view";

export class Filter implements Subject {
    public filteredData: [];
    private observers: Array<any> = [];
    private view: FilterView;
    private data: any;
    private filterModel: any;

    constructor(view: FilterView) {
        this.view = view;
        document.querySelector(this.view._selector).addEventListener('submit', this.submitEventHandler.bind(this));
        document.querySelector(this.view._selector).addEventListener('focusout', this.focusoutEventHandler.bind(this));
        document.querySelector(this.view._selector).addEventListener('keydown', this.keypressEventHandler.bind(this));
        document.querySelector(this.view._selector).addEventListener('click', this.clickEventHandler.bind(this));
    }

    initialize(data, model) {
        this.filterModel = model;
        this.data = data;
        this.calculateRange();
        this.filter();
        this.show();
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
            observer(this.filteredData);
        }
    }

    clickEventHandler (e) {
        e.stopPropagation();
        if(e.target.className === 'resetFilter') {
            this.filterModel[e.target.dataset['property']].selectMin = this.filterModel[e.target.dataset['property']].min;
            this.filterModel[e.target.dataset['property']].selectMax = this.filterModel[e.target.dataset['property']].max;
            this.show();
        }
    }

    keypressEventHandler(e) {
        if(e.code ==='Enter') {
            e.preventDefault();
        }
    }

    focusoutEventHandler(e) {
        if (e.target.tagName==='BUTTON') {
            return true;
        }
        let elem = e.target;
        if (elem.value <= this.filterModel[elem.dataset['property']].min) {
            e.target.value = this.filterModel[elem.dataset['property']].min;
        }
        if (elem.value >= this.filterModel[elem.dataset['property']].max) {
            e.target.value = this.filterModel[elem.dataset['property']].max;
        }

        this.filterModel[elem.dataset['property']]['select'+elem.dataset['use']] = +elem.value;
        this.show();
    }

    submitEventHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        for (let i = 0; i < e.target.length - 1; i++) {
            if (e.target[i].dataset['use'] === 'Min') {
                this.filterModel[e.target[i].dataset['property']].selectMin = +e.target[i].value;
            }
            if (e.target[i].dataset['use'] === 'Max') {
                this.filterModel[e.target[i].dataset['property']].selectMax = +e.target[i].value;
            }
        }
        this.filter();
        this.notify();
    }

    show(): void {
        this.view.render(this.filterModel);
    }

    private filter() {
        let self = this;
        this.filteredData = this.data.filter(item => {
            return Object.keys(this.filterModel).every(key => {
                return (item[key] <= self.filterModel[key].selectMax) && (item[key] >= self.filterModel[key].selectMin);
            });
        });
    }

    private calculateRange() {
        this.data.forEach(item => {
            Object.keys(this.filterModel).forEach(key => {
                if (item[key] > this.filterModel[key].max) {
                    this.filterModel[key].max = item[key]
                }

                if (item[key] < this.filterModel[key].min) {
                    this.filterModel[key].min = item[key]
                }
            })
        })
    }
}
