export class FilterModeIItem {
    title: string;
    min: number = Number.MAX_SAFE_INTEGER;
    max: number = 0;
    selectMin:number;
    selectMax: number;
    constructor(title: string) {
        this.title = title;
    }
}