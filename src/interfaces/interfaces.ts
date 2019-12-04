export interface Subject {
    attach(observer: any): void;
    detach(observer: any): void;
    notify(): void;
}

export interface Rendereble {
    _selector: string;
    render(...args: any[]): void;
}

