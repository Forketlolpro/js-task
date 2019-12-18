export class HeaderModelItem {
    title: string;
    sortable: boolean;

    constructor(title: string, sortable: boolean) {
        this.title = title;
        this.sortable = sortable;
    }
}