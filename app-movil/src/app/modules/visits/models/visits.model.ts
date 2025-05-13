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

export interface SellerVisits {
  seller_id: string;
  visits_info: VisitList[];
}
export interface VisitList {
  customer_name: string;
  customer_phonenumber: string;
  store_name: string;
  visit_address: string;
  visit_date: Date; 
  visit_id: string;
  visit_status: 'NO_VISITADO' | 'VISITADO' | string;
}
