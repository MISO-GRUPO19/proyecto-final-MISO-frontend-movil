import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { AuthManager } from '../services/auth.service';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { rolesEnum } from '../../roles.enum';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthManager: jasmine.SpyObj<AuthManager>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate'], {
      events: of(),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as UrlTree),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('/mock-url')
    });

    const mockActivatedRoute = {
      snapshot: { queryParams: {} }
    };

    mockAuthManager = jasmine.createSpyObj<AuthManager>('AuthManager', ['registerCustomers']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        RxFormBuilder,
        TranslateService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthManager, useValue: mockAuthManager }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe enviar si el formulario es inválido', () => {
    spyOnProperty(component.formGroup, 'invalid', 'get').and.returnValue(true);
    component.onSubmit();
    expect(mockAuthManager.registerCustomers).not.toHaveBeenCalled();
  });

  it('debe registrar y redirigir a /profile', () => {
    component.formGroup.setValue({
      email: 'test@email.com',
      password: '123456',
      confirmPassword: '123456'
    });

    mockAuthManager.registerCustomers.and.returnValue(of({}));

    component.onSubmit();

    expect(mockAuthManager.registerCustomers).toHaveBeenCalledWith({
      email: 'test@email.com',
      password: '123456',
      confirm_password: '123456',
      role: rolesEnum.Cliente
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile'], {
      queryParams: { email: 'test@email.com' }
    });
  });

  it('debe mostrar error del backend si existe mssg', () => {
    component.formGroup.setValue({
      email: 'fail@email.com',
      password: '123456',
      confirmPassword: '123456'
    });

    mockAuthManager.registerCustomers.and.returnValue(
      throwError(() => ({
        error: { mssg: 'Error desde el backend' }
      }))
    );

    component.onSubmit();

    expect(component.error).toBe('Error desde el backend');
  });

  it('debe mostrar error genérico si no existe mssg en el error', () => {
    component.formGroup.setValue({
      email: 'error@email.com',
      password: '123456',
      confirmPassword: '123456'
    });

    mockAuthManager.registerCustomers.and.returnValue(
      throwError(() => ({
        error: {}
      }))
    );

    component.onSubmit();

    expect(component.error).toBe('Error de autenticación');
  });

  it('no debe navegar si ocurre error en el registro', () => {
    component.formGroup.setValue({
      email: 'error@email.com',
      password: '123456',
      confirmPassword: '123456'
    });

    mockAuthManager.registerCustomers.and.returnValue(
      throwError(() => ({
        error: { mssg: 'Error al registrar' }
      }))
    );

    component.onSubmit();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
