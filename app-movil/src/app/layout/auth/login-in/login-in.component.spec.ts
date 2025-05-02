import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginInComponent } from './login-in.component';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('LoginInComponent', () => {
    let component: LoginInComponent;
    let fixture: ComponentFixture<LoginInComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginInComponent],
            providers: [
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginInComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should remove tokens and navigate to login on goToHome', () => {
        localStorage.setItem('access_token', 'token');
        localStorage.setItem('refresh_token', 'refresh');
        localStorage.setItem('user', JSON.stringify({ name: 'test' }));

        component.goToHome();

        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should call goToHome after 3 seconds', fakeAsync(() => {
        spyOn(component, 'goToHome');
        component.ngOnInit();
        tick(3000);
        expect(component.goToHome).toHaveBeenCalled();
    }));
});
