import { ProductImage } from "./product.image";
import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  price: number;
  price_old?: number;
  thumbnail: string;
  description: string;
  category_id: number;
  category?: Category;
  stock_quantity: number;
  url: string;
  product_images: ProductImage[];
}


