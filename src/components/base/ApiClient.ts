import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types';

export class ApiClient {
    constructor(private api: IApi) {}

    fetchProducts(): Promise<IProduct> {
        return this.api.get<IProduct>('/product/');
    }

    sendOrder(evt: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', evt);
    }
}