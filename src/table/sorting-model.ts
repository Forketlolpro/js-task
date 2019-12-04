export class SortingModel {
    key: string;
    direction: string = 'original';
    ascCallback: (a, b) => (number);
    descCallback: (a, b) => (number);
    constructor() {
        this.ascCallback = function (a, b) {
            if (a[this.sortingModel.key] > b[this.sortingModel.key]) {
                return 1;
            }
            if (a[this.sortingModel.key] < b[this.sortingModel.key]) {
                return -1;
            }
            return 0;
        };

        this.descCallback = function (a, b) {
            if (a[this.sortingModel.key] < b[this.sortingModel.key]) {
                return 1;
            }
            if (a[this.sortingModel.key] > b[this.sortingModel.key]) {
                return -1;
            }
            return 0;
        }
    }
}