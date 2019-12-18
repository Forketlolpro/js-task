import {FilterView} from "../interfaces/interfaces";

export class DefaultFilterView implements FilterView {
    selector: string;

    constructor(selector: string) {
        this.selector = selector
    }

    generateResetButton(item) {
        if (item[1].selectMin > item[1].min || item[1].selectMax < item[1].max) {
            return `<button data-property="${item[0]}" type="reset" class="resetFilter">&#10005;</button>`
        }

        return ``;
    }

    generateFilterItem(item) {
        let inputMinValue = (item[1]['selectMin'] && item[1]['selectMin'] >= item[1]['min']) ? item[1]['selectMin'] : item[1]['min'];
        let inputMaxValue = (item[1]['selectMax'] && item[1]['selectMax'] <= item[1]['max']) ? item[1]['selectMax'] : item[1]['max'];
        return `<div>
                    <label>${item[1]['title']}: </label>
                    <input class="form-control" data-use="Min" data-property="${item[0]}" value="${inputMinValue}" type="number">
                    <input class="form-control" data-use="Max" data-property="${item[0]}" value="${inputMaxValue}" type="number">
                    ${this.generateResetButton(item)}
                </div>`
    }

    generateFilterForm(model) {
        return `<form>
                    ${Object.entries(model).map((item) => {
            return this.generateFilterItem(item);
        }).join(' ')}
                    <button class="btn btn-primary"type="submit">Apply</button>
                </form>`
    }

    generateTemplate(model) {
        return `<h2>Filters</h2>${this.generateFilterForm(model)}`
    }

    render(...args: any[]): void {
        let model = args[0];
        document.querySelector(this.selector).innerHTML = this.generateTemplate(model);
    }
}