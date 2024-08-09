export interface Item {
    category: string;
    name: string;
    price: number;
}

export interface Items {
    [key: string]: Item[];
}
