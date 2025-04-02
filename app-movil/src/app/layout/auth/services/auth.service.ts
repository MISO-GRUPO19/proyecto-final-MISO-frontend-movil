
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthManager {
    private apiUrl = environment.apiUrl + '/users/login'; // API
    private http = inject(HttpClient);

    constructor() { }

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl, credentials).pipe(
            tap(response => {
                sessionStorage.setItem('access_token', response.access_token);
                sessionStorage.setItem('refresh_token', response.refresh_token);
                sessionStorage.setItem('user', JSON.stringify(response.user));
            })
        );
    }

    logout() {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user');
    }

    getAccessToken(): string | null {
        return sessionStorage.getItem('access_token');
    }

    isLoggedIn(): boolean {
        return !!sessionStorage.getItem('access_token');
    }

}
