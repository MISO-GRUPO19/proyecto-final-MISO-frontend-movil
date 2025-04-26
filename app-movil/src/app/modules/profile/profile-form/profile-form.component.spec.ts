import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileFormComponent } from './profile-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { AuthManager } from '../../../layout/auth/services/auth.service';
import { of, throwError } from 'rxjs';

describe('ProfileFormComponent', () => {
    let component: ProfileFormComponent;
    let fixture: ComponentFixture<ProfileFormComponent>;
    let mockAuthManager: jasmine.SpyObj<AuthManager>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        mockAuthManager = jasmine.createSpyObj('AuthManager', ['createCustomers']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ProfileFormComponent, TranslateModule.forRoot()],
            providers: [
                TranslateService,
                RxFormBuilder,
                { provide: Router, useValue: mockRouter },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: of(convertToParamMap({ email: 'test@email.com' }))
                    }
                },
                { provide: AuthManager, useValue: mockAuthManager }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        // Garantizar desuscripción
        component?.ngOnDestroy?.();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe guardar el email si viene por queryParam', () => {
        expect(component.email).toBe('test@email.com');
    });

    it('no debe enviar si el formulario es inválido', () => {
        spyOnProperty(component.formGroup, 'invalid', 'get').and.returnValue(true);
        component.onSubmit();
        expect(mockAuthManager.createCustomers).not.toHaveBeenCalled();
    });

    it('debe llamar a createCustomers y redirigir a /register-success si es válido', () => {
        component.email = 'cliente@email.com';
        component.formGroup.setValue({
            name: 'Juan',
            lastName: 'Pérez',
            country: 'Colombia',
            address: 'Calle 123',
            telphone: 3001234567
        });

        mockAuthManager.createCustomers.and.returnValue(of({}));

        component.onSubmit();

        expect(mockAuthManager.createCustomers).toHaveBeenCalledWith({
            firstName: 'Juan',
            lastName: 'Pérez',
            country: 'Colombia',
            address: 'Calle 123',
            phoneNumber: 3001234567,
            email: 'cliente@email.com'
        });

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/register-success']);
    });

    it('debe manejar el error y mostrar mensaje si el backend falla', () => {
        component.email = 'cliente@email.com';
        component.formGroup.setValue({
            name: 'Juan',
            lastName: 'Pérez',
            country: 'Colombia',
            address: 'Calle 123',
            telphone: 3001234567
        });

        mockAuthManager.createCustomers.and.returnValue(
            throwError(() => ({ error: { mssg: 'Fallo en creación' } }))
        );

        component.onSubmit();

        expect(component.error).toBe('Fallo en creación');
    });
});
