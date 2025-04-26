import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginInComponent } from './login-in.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('LoginInComponent', () => {
    let component: LoginInComponent;
    let fixture: ComponentFixture<LoginInComponent>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [LoginInComponent, CommonModule],
            providers: [
                { provide: Router, useValue: mockRouter }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe ejecutar goToHome después de 3 segundos', fakeAsync(() => {
        spyOn(component, 'goToHome');
        component.ngOnInit();

        tick(3000); // Simula los 3 segundos
        expect(component.goToHome).toHaveBeenCalled();
    }));

    it('debe limpiar sessionStorage y redirigir a /auth/login', () => {
        const removeSpy = spyOn(sessionStorage, 'removeItem');
        component.goToHome();

        expect(removeSpy).toHaveBeenCalledWith('access_token');
        expect(removeSpy).toHaveBeenCalledWith('refresh_token');
        expect(removeSpy).toHaveBeenCalledWith('user');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
});
