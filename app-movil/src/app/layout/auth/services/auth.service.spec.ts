import { TestBed } from '@angular/core/testing';
import { AuthManager } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('AuthManager', () => {
    let service: AuthManager;
    let httpMock: HttpTestingController;

    // ✅ Respetando el modelo LoginResponse y UserResponse
    const dummyResponse = {
        access_token: 'abc123',
        refresh_token: 'xyz456',
        isCustomer: true,
        user: {
            id: '1',
            email: 'john@example.com',
            role: 1
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthManager]
        });

        service = TestBed.inject(AuthManager);
        httpMock = TestBed.inject(HttpTestingController);
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and store tokens', () => {
        const credentials = { email: 'test@test.com', password: '123456' };

        service.login(credentials).subscribe(response => {
            expect(response).toEqual(dummyResponse);
            expect(localStorage.getItem('access_token')).toBe(dummyResponse.access_token);
            expect(localStorage.getItem('refresh_token')).toBe(dummyResponse.refresh_token);
            expect(localStorage.getItem('user')).toBe(JSON.stringify(dummyResponse.user));
        });

        const req = httpMock.expectOne(environment.apiUrl + '/users/login');
        expect(req.request.method).toBe('POST');
        req.flush(dummyResponse);
    });

    it('should logout and remove tokens', () => {
        localStorage.setItem('access_token', 'abc');
        localStorage.setItem('refresh_token', 'xyz');
        localStorage.setItem('user', JSON.stringify({
            id: '1',
            email: 'john@example.com',
            role: 1
        }));

        service.logout();

        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('should get access token from sessionStorage', () => {
        localStorage.setItem('access_token', 'abc');
        const token = service.getAccessToken();
        expect(token).toBe('abc');
    });

    it('should return true if logged in', () => {
        localStorage.setItem('access_token', 'abc');
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if not logged in', () => {
        localStorage.removeItem('access_token');
        expect(service.isLoggedIn()).toBeFalse();
    });
});
