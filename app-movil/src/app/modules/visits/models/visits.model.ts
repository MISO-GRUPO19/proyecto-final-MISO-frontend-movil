export class SellerVisits {
  public seller_id: string = '';
  public visits_info: VisitList[] = [];
}
export class VisitList {
  public customer_name: string = '';
  public customer_phonenumber: string = '';
  public store_name: string = '';
  public visit_address: string = '';
  public visit_date: Date = new Date();
  public visit_id: string = '';
  public visit_status: 'NO_VISITADO' | 'VISITADO' | string = '';
}

export class ChangeStateModel {
  public state: string = '';
}
export class ChangeStateModelResponse {
  public message: string = '';
}

export enum VisitStatus {
  VISITADO = 'VISITADO',
  NO_VISITADO = 'NO_VISITADO'
}

export const STATUS_VISITS: Record<VisitStatus, string> = {
  [VisitStatus.VISITADO]: 'Visitado',
  [VisitStatus.NO_VISITADO]: 'No visitado'
};

export const ALLOWED_STATUS: VisitStatus[] = Object.keys(STATUS_VISITS) as VisitStatus[];