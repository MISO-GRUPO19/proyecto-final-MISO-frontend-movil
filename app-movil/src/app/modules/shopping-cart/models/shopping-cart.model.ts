export class OrderProduct {
    public barcode: string = '';
    public quantity: number = 0;
}

export class OrderPayload {
    public client_id: string = '';
    public date: Date = new Date();
    public total: number = 0;
    public type: 'CLIENTE' | 'VENDEDOR' = 'CLIENTE';
    public products: OrderProduct[] = [];
}
