import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthManager } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { rolesEnum } from '../../roles.enum';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { importProvidersFrom } from '@angular/core';
import { LoginResponse } from '../models/login-form.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authManagerMock: jasmine.SpyObj<AuthManager>;
  let router: Router;

  beforeEach(async () => {
    authManagerMock = jasmine.createSpyObj<AuthManager>('AuthManager', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        RxFormBuilder,
        { provide: AuthManager, useValue: authManagerMock },
        provideRouter([]),
        importProvidersFrom(TranslateModule.forRoot())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.formGroup.controls.email.setValue('');
    component.formGroup.controls.password.setValue('');
    component.onSubmit();
    expect(authManagerMock.login).not.toHaveBeenCalled();
  });

  it('should show error if user is Admin', () => {
    const response: LoginResponse = {
      access_token: 'token',
      refresh_token: 'refresh',
      isCustomer: false,
      user: { email: 'admin@test.com', id: '1', role: rolesEnum.Administrador }
    };

    component.formGroup.controls.email.setValue('admin@test.com');
    component.formGroup.controls.password.setValue('123456');

    authManagerMock.login.and.returnValue(of(response));
    component.onSubmit();

    expect(component.error).toBe('Los usuarios con el rol de Administrador no pueden ingresar.');
  });

  it('should navigate to profile if user is Client and not a customer', fakeAsync(() => {
    const response: LoginResponse = {
      access_token: 'token',
      refresh_token: 'refresh',
      isCustomer: false,
      user: { email: 'client@test.com', id: '1', role: rolesEnum.Cliente }
    };

    component.formGroup.controls.email.setValue('client@test.com');
    component.formGroup.controls.password.setValue('123456');

    authManagerMock.login.and.returnValue(of(response));
    component.onSubmit();
    tick();

    expect(localStorage.getItem('access_token')).toBe('token');
    expect(router.navigate).toHaveBeenCalledWith(['/profile'], {
      queryParams: { email: 'client@test.com' }
    });
  }));

  it('should navigate to /home/deliveries if user is Client and is a customer', fakeAsync(() => {
    const response: LoginResponse = {
      access_token: 'token',
      refresh_token: 'refresh',
      isCustomer: true,
      user: { email: 'client@test.com', id: '1', role: rolesEnum.Cliente }
    };

    component.formGroup.controls.email.setValue('client@test.com');
    component.formGroup.controls.password.setValue('123456');

    authManagerMock.login.and.returnValue(of(response));
    component.onSubmit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/home/deliveries']);
  }));

  it('should navigate to /home/clients if user is Seller', fakeAsync(() => {
    const response: LoginResponse = {
      access_token: 'token',
      refresh_token: 'refresh',
      isCustomer: false,
      user: { email: 'seller@test.com', id: '1', role: rolesEnum.Vendedor }
    };

    component.formGroup.controls.email.setValue('seller@test.com');
    component.formGroup.controls.password.setValue('123456');

    authManagerMock.login.and.returnValue(of(response));
    component.onSubmit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/home/clients']);
  }));

  it('should set error message on login failure', fakeAsync(() => {
    const errorResponse = {
      error: { mssg: 'Credenciales incorrectas' }
    };

    component.formGroup.controls.email.setValue('fail@test.com');
    component.formGroup.controls.password.setValue('wrong');

    authManagerMock.login.and.returnValue(throwError(() => errorResponse));
    component.onSubmit();
    tick();

    expect(component.error).toBe('Credenciales incorrectas');
  }));
});
