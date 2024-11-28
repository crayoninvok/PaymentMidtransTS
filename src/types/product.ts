

export interface ProductColor {
  value: string;
  label: string;
}

export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
  colors: ProductColor[];
}
