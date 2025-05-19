

export class ClientsList {
    public id: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public country: string = '';
    public address: string = '';
    public email: string = '';
    public phoneNumber: string = '';
    public stores: Store[] = [];
}
export class Store {
    store_name: string = '';
    store_address: string = '';
}
