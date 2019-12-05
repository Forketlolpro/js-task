import {Rendereble} from "../interfaces/interfaces";

const IMAGE_PREFIX = 'https://s3.eu-central-1.amazonaws.com/showcase-demo-images/fashion/images/';

export class TableView implements Rendereble {
    _selector: string;
    get selector(): string {
        return this._selector;
    }

    constructor(selector: string) {
        this._selector = selector;
    }

    private generateHeader(headerModel, sortingModel) {
        return Object.keys(headerModel).map(key => {
            let htmlClass = '';
            if (sortingModel.prop === key) {
                htmlClass = sortingModel.direction ? sortingModel.direction: '';
            }
            return (headerModel[key].sortable) ? `<th class='${htmlClass}' data-property='${key}'> ${headerModel[key].title} </th>` : `<th> ${headerModel[key].title} </th>`;
        }).join(' ');
    }

    generateImageCell(row, key) {
        return `<td><img src="${IMAGE_PREFIX+row['image']}"></td>`;
    }

    generateNameCell(row, key) {
        return `<td>${row[key] + ' ' + row['productKey']}</td>`;
    }


    //вот тут так себе получилось(
    private generateBody(data, headerModel) {
        return data.map(row => {
            return `<tr>${Object.keys(headerModel).map(key => {
                if (key ==='image') {
                    return this.generateImageCell(row,key)
                }
                return (key==='displayName') ? this.generateNameCell(row,key): `<td>${row[key]}</td>`;
            }).join(' ')}</tr>`
        }).join(' ');
    }

    generateTemplate(headerModel, bodyData, sortingModel) {
        return `<table class="table table-striped table-hover">
                    <thead class="thead-light">${this.generateHeader(headerModel, sortingModel)}</thead>
                    <tbody>${this.generateBody(bodyData, headerModel)}</tbody>
                </table>`
    }

    render(headerModel, bodyModel, sortingModel) {
        document.querySelector(this._selector).innerHTML = this.generateTemplate(headerModel, bodyModel, sortingModel);
    }
}