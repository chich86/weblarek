import { IProduct } from "./../../types";
import { EventEmitter } from '../base/Events';

export class Product extends EventEmitter {
  private selected: IProduct | null = null;
  private products: IProduct[] = [];

  constructor() {
    super();
  }

  getSelected(): IProduct | null {
    return this.selected;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  setSelected(product: IProduct): void {
    this.selected = product;
    this.emit("product:selected", { product });
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.emit("product:list-changed", { products });
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
}
