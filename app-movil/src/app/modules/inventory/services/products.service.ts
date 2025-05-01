
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { ProductsList } from '../models/inventory.model';

@Injectable({
    providedIn: 'root',
})
export class ProductsManager {
    private apiUrl = environment.apiUrl; // API
    private http = inject(HttpClient);
    private headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
    };

    constructor() { }

    getProductsInventory(): Observable<ProductsList[]> {
        return this.http.get<ProductsList[]>(this.apiUrl + '/products', { headers: this.headers })
    }


}
