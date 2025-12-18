import { IProduct } from './../../types';
import { EventEmitter } from '../base/Events';

export class Cart extends EventEmitter {
  private items: IProduct[] = [];

  constructor() {
    super();
  }

  getItems(): IProduct[] {
    return this.items;
  }

  hasItem(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.items.push(product);
      this.emit('cart:item-added', product);
      this.emit('cart:changed', this.items);
    }
  }

  removeItem(itemId: string): void {
  this.items = this.items.filter((item) => item.id !== itemId);
  this.emit('cart:item-removed', { itemId });
  this.emit('cart:changed', { items: this.items });
}


  clear(): void {
    this.items = [];
    this.emit('cart:cleared');
    this.emit('cart:changed', this.items);
  }

  getCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce(
      (total, item) => total + (item.price ?? 0),
      0
    );
  }
}
