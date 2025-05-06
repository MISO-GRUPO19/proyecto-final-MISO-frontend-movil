export class Visit {
    public id: number = 0;
    public clientName: string = '';
    public storeName: string = '';
    public visitDate: string = '';
    public phoneNumber: string = '';
    public address: string = '';
    public visitStatus: 'visited' | 'notVisited' | 'next' = 'notVisited';
    public timingTag: 'Próximo' | 'Más tarde' | 'Visitado' = 'Próximo';
}
