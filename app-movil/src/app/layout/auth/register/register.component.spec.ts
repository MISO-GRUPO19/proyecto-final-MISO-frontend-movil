import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthManager } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { rolesEnum } from '../../roles.enum';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthManager: jasmine.SpyObj<AuthManager>;
  let mockRouter: jasmine.SpyObj<Router>;
  const mockNavController = jasmine.createSpyObj('NavController', ['navigateForward']);

  const mockActivatedRoute = {
    snapshot: { paramMap: new Map() },
    params: of({})
  };

  beforeEach(waitForAsync(() => {
    mockAuthManager = jasmine.createSpyObj('AuthManager', ['registerCustomers']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RxReactiveFormsModule,
        TranslateModule.forRoot(),
        CommonModule,
        RegisterComponent,
        RouterTestingModule
      ],
      providers: [
        RxFormBuilder,
        TranslateService,
        TranslateStore,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NavController, useValue: mockNavController },
        { provide: AuthManager, useValue: mockAuthManager }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.formGroup).toBeTruthy();
  });

  it('should not call registerCustomers if form is invalid', () => {
    component.onSubmit();
    expect(mockAuthManager.registerCustomers).not.toHaveBeenCalled();
  });

  it('should call registerCustomers with correct values on valid form', () => {
    component.formGroup.setValue({
      email: 'test@email.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    });

    mockAuthManager.registerCustomers.and.returnValue(of({}));

    component.onSubmit();

    expect(mockAuthManager.registerCustomers).toHaveBeenCalledWith({
      email: 'test@email.com',
      password: 'Password123',
      confirm_password: 'Password123',
      role: rolesEnum.Cliente
    });
  });

  it('should navigate to /profile on successful registration', () => {
    component.formGroup.setValue({
      email: 'user@test.com',
      password: '12345678',
      confirmPassword: '12345678'
    });

    mockAuthManager.registerCustomers.and.returnValue(of({}));

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile'], {
      queryParams: { email: 'user@test.com' }
    });
  });

  it('should show error message from backend', () => {
    component.formGroup.setValue({
      email: 'fail@test.com',
      password: 'fail123',
      confirmPassword: 'fail123'
    });

    mockAuthManager.registerCustomers.and.returnValue(throwError(() => ({
      error: { mssg: 'Correo ya registrado' }
    })));

    component.onSubmit();

    expect(component.error).toBe('Correo ya registrado');
  });

  it('should show default error message if none is provided', () => {
    component.formGroup.setValue({
      email: 'fail@test.com',
      password: 'fail123',
      confirmPassword: 'fail123'
    });

    mockAuthManager.registerCustomers.and.returnValue(throwError(() => ({
      error: {}
    })));

    component.onSubmit();

    expect(component.error).toBe('Error de autenticación');
  });
});