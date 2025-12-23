import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types';

export class ApiClient {
  constructor(private api: IApi) {}

  fetchProducts(): Promise<IProduct[]> {
    return this.api
      .get<{ items: IProduct[] }>('/product/')
      .then(res => res.items);
  }

  sendOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', data);
  }
}
