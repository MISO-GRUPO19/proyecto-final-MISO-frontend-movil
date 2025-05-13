
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { SellerVisits } from '../models/visits.model';

@Injectable({
    providedIn: 'root',
})
export class VisitsManager {
    private apiUrl = environment.apiUrl; // API
    private http = inject(HttpClient);
    private headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
    };

    constructor() { }

    getVisitsBySeller(sellerId: string): Observable<SellerVisits> {
        return this.http.get<SellerVisits>(this.apiUrl + '/orders/visits/' + sellerId , { headers: this.headers })
    }


}
