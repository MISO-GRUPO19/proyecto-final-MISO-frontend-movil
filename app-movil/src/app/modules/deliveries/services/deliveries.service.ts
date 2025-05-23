
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { OrderResponse } from '../models/deliveries.model';
import { OrderPayload } from '../../shopping-cart/models/shopping-cart.model';

@Injectable({
    providedIn: 'root',
})
export class OrdersManager {
    private apiUrl = environment.apiUrl; // API
    private http = inject(HttpClient);
    private headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
    };

    constructor() { }

    getOrdersByClient(id: string): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(this.apiUrl + '/orders/' + id, { headers: this.headers })
    }

    getOrdersById(id: string): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(this.apiUrl + '/orders/order/' + id, { headers: this.headers })
    }
    createOrder(order: OrderPayload): Observable<OrderPayload> {
        return this.http.post<OrderPayload>(this.apiUrl + '/orders', order, { headers: this.headers })
    }

}
