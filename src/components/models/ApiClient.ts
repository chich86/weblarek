import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types';

export class ApiClient {
    constructor(private api: IApi) {}

    fetchProducts(): Promise<IProduct[]> {
    return this.api.get<{ items: IProduct[]; total: number }>('/product/')
        .then(res => res.items);
}

    sendOrder(evt: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', evt);
    }
}