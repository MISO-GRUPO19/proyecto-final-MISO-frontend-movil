import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthManager } from '../services/auth.service';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthManager: jasmine.SpyObj<AuthManager>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockAuthManager = jasmine.createSpyObj('AuthManager', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot(),
        RxReactiveFormsModule,
        LoginComponent,
      ],
      providers: [
        TranslateService,
        TranslateStore,
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: new Map() } } },
        { provide: Router, useValue: mockRouter },
        { provide: AuthManager, useValue: mockAuthManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.formGroup.valid).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(mockAuthManager.login).not.toHaveBeenCalled();
  });

  it('should call authManager.login on valid form submit', () => {
    component.formGroup.setValue({
      email: 'test@email.com',
      password: 'password123'
    });

    mockAuthManager.login.and.returnValue(of({
      access_token: 'abc',
      refresh_token: 'xyz',
      user: { name: 'John' }
    }));

    component.onSubmit();
    expect(mockAuthManager.login).toHaveBeenCalledWith(component.formGroup.value);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
  it('should have invalid form initially', () => {
    expect(component.formGroup.valid).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    component.formGroup.setValue({ email: '', password: '' }); // vacío = inválido
    component.onSubmit();
    expect(mockAuthManager.login).not.toHaveBeenCalled();
  });

  it('should submit form and navigate on success', () => {
    component.formGroup.setValue({
      email: 'user@test.com',
      password: 'password123'
    });

    mockAuthManager.login.and.returnValue(of({
      access_token: 'token',
      refresh_token: 'refresh',
      user: { name: 'John' }
    }));

    component.onSubmit();

    expect(mockAuthManager.login).toHaveBeenCalledWith(component.formGroup.value);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error message on login failure', () => {
    component.formGroup.setValue({
      email: 'fail@test.com',
      password: 'wrong'
    });

    mockAuthManager.login.and.returnValue(throwError(() => ({
      error: { message: 'Credenciales inválidas' }
    })));

    component.onSubmit();

    expect(component.error).toBe('Credenciales inválidas');
  });
  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.formGroup).toBeTruthy();
  });
  it('should show default error message if none provided', () => {
    component.formGroup.setValue({
      email: 'user@test.com',
      password: 'wrong'
    });

    mockAuthManager.login.and.returnValue(throwError(() => ({
      error: {}
    })));

    component.onSubmit();

    expect(component.error).toBe('Error de autenticación');
  });
  it('should store tokens in sessionStorage on success', () => {
    const values = {
      email: 'store@test.com',
      password: 'store123'
    };

    component.formGroup.setValue(values);

    spyOn(sessionStorage, 'setItem');

    mockAuthManager.login.and.returnValue(of({
      access_token: 'token123',
      refresh_token: 'refresh123',
      user: { name: 'Jane' }
    }));

    component.onSubmit();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('access_token', 'token123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('refresh_token', 'refresh123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ name: 'Jane' }));
  });
  it('should validate email field as required', () => {
    const emailControl = component.formGroup.controls['email'];
    emailControl.setValue('');
    expect(emailControl.errors?.['required']).toBeDefined();
  });

  it('should validate email field format', () => {
    const emailControl = component.formGroup.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.errors?.['email']).toBeDefined();
  });

  it('should validate password field as required', () => {
    const passwordControl = component.formGroup.controls['password'];
    passwordControl.setValue('');
    expect(passwordControl.errors?.['required']).toBeDefined();
  });
});
