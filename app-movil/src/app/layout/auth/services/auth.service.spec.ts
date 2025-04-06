import { TestBed } from '@angular/core/testing';
import { AuthManager } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('AuthManager', () => {
    let service: AuthManager;
    let httpMock: HttpTestingController;

    const dummyResponse = {
        access_token: 'abc123',
        refresh_token: 'xyz456',
        user: { name: 'John' }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthManager]
        });

        service = TestBed.inject(AuthManager);
        httpMock = TestBed.inject(HttpTestingController);
        sessionStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        sessionStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and store tokens', () => {
        const credentials = { email: 'test@test.com', password: '123456' };

        service.login(credentials).subscribe(response => {
            expect(response).toEqual(dummyResponse);
            expect(sessionStorage.getItem('access_token')).toBe(dummyResponse.access_token);
            expect(sessionStorage.getItem('refresh_token')).toBe(dummyResponse.refresh_token);
            expect(sessionStorage.getItem('user')).toBe(JSON.stringify(dummyResponse.user));
        });

        const req = httpMock.expectOne(environment.apiUrl + '/users/login');
        expect(req.request.method).toBe('POST');
        req.flush(dummyResponse);
    });

    it('should logout and remove tokens', () => {
        sessionStorage.setItem('access_token', 'abc');
        sessionStorage.setItem('refresh_token', 'xyz');
        sessionStorage.setItem('user', '{"name":"John"}');

        service.logout();

        expect(sessionStorage.getItem('access_token')).toBeNull();
        expect(sessionStorage.getItem('refresh_token')).toBeNull();
        expect(sessionStorage.getItem('user')).toBeNull();
    });

    it('should get access token from sessionStorage', () => {
        sessionStorage.setItem('access_token', 'abc');
        const token = service.getAccessToken();
        expect(token).toBe('abc');
    });

    it('should return true if logged in', () => {
        sessionStorage.setItem('access_token', 'abc');
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if not logged in', () => {
        sessionStorage.removeItem('access_token');
        expect(service.isLoggedIn()).toBeFalse();
    });

});
