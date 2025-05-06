
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { LoginResponse } from '../models/login-form.model';

@Injectable({
    providedIn: 'root',
})
export class AuthManager {
    private apiUrl = environment.apiUrl; // API
    private http = inject(HttpClient);

    constructor() { }

    login(credentials: { email: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.apiUrl + '/users/login', credentials).pipe(
            tap(response => {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                localStorage.setItem('user', JSON.stringify(response.user));
            })
        );
    }

    registerCustomers(credentials: { email: string; password: string; confirm_password: string; role: number }): Observable<any> {
        return this.http.post<any>(this.apiUrl + '/users', credentials);
    }

    createCustomers(form: { firstName: string; lastName: string; country: string; address: string; phoneNumber: number; email: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl + '/users/customers', form);
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('access_token');
    }

}
