

export type Category = {
    type: 'category'
    id: string
    label: string;
    children?: Array<Category>
}

export interface Product {
    id: string;
    type: 'product';
    label: string;
    image: string;
}