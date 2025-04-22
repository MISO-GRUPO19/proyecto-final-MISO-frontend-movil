export class OrderResponse {
    public id: string = '';
    public code: string = '';
    public client_id: string = '';
    public seller_id: string = '';
    public seller_info: SellerInfo = new SellerInfo();
    public date_order: string = '';
    public provider_id: string = '';
    public total: number = 0;
    public type: string = '';
    public state: string = '';
    public route_id: string = '';
    public products: ProductInfo[] = [];
    public status_history: StatusHistory[] = [];
}

export class SellerInfo {
    public name?: string;
    public identification?: string;
    public country?: string;
    public address?: string;
    public telephone?: string;
    public email?: string;
}

export class ProductInfo {
    public name?: string;
    public barcode: string = '';
    public quantity: number = 0;
}

export class StatusHistory {
    public status: string = '';
    public timestamp: string = '';
}
