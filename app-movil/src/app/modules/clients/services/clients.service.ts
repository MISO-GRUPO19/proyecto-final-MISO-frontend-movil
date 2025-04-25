
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { ClientsList } from '../models/clients.model';

@Injectable({
    providedIn: 'root',
})
export class ClientsManager {
    private apiUrl = environment.apiUrl; // API
    private http = inject(HttpClient);
    private headers = {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
    constructor() { }

    getClients(): Observable<ClientsList[]> {
        return this.http.get<ClientsList[]>(this.apiUrl + '/customers', { headers: this.headers })
    }

}
