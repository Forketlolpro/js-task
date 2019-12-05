import {SortDirection} from "../table/sort-direction";

export function sortFunc(prop: string, order: SortDirection) {
    //if (!prop) return 0;
    return (a: any, b: any) => {
        if (!a.hasOwnProperty(prop) || !b.hasOwnProperty(prop)) return 0;
        let comparison = 0;
        if (a[prop] > b[prop]) comparison = 1;
        if (a[prop] < b[prop]) comparison = -1;
        return order === 'desc' ? comparison * -1 : comparison;
    }
}