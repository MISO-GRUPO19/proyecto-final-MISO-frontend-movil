import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthManager } from '../services/auth.service';
import { RxReactiveFormsModule, RxFormBuilder } from '@rxweb/reactive-form-validators';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { rolesEnum } from '../../roles.enum';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let mockAuthManager: jasmine.SpyObj<AuthManager>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate'], {
      events: of(),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as UrlTree),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('/mock-url')
    });

    const mockActivatedRoute = {
      snapshot: { queryParams: {} }
    };

    const mockNavController = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateRoot', 'back']);
    mockAuthManager = jasmine.createSpyObj<AuthManager>('AuthManager', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        RxFormBuilder,
        TranslateService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NavController, useValue: mockNavController },
        { provide: AuthManager, useValue: mockAuthManager }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function buildResponse(role: rolesEnum, isCustomer: boolean) {
    return {
      access_token: 'abc',
      refresh_token: 'def',
      isCustomer,
      user: {
        id: 'u1',
        email: 'test@mail.com',
        role
      }
    };
  }

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe enviar el formulario si es inválido', () => {
    spyOnProperty(component.formGroup, 'invalid', 'get').and.returnValue(true);
    component.onSubmit();
    expect(mockAuthManager.login).not.toHaveBeenCalled();
  });

  it('debe redirigir a /profile si Cliente no es customer', () => {
    component.formGroup.setValue({ email: 'test@mail.com', password: '1234' });
    mockAuthManager.login.and.returnValue(of(buildResponse(rolesEnum.Cliente, false)));

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile'], {
      queryParams: { email: 'test@mail.com' }
    });
  });

  it('debe redirigir a /home/deliveries si Cliente es customer', () => {
    component.formGroup.setValue({ email: 'client@mail.com', password: '1234' });
    mockAuthManager.login.and.returnValue(of(buildResponse(rolesEnum.Cliente, true)));

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/deliveries']);
  });

  it('debe redirigir a /home/inventory si es Vendedor', () => {
    component.formGroup.setValue({ email: 'vendedor@mail.com', password: '1234' });
    mockAuthManager.login.and.returnValue(of(buildResponse(rolesEnum.Vendedor, false)));

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/clients']);
  });

  it('debe bloquear si es Administrador', () => {
    component.formGroup.setValue({ email: 'admin@mail.com', password: '1234' });
    mockAuthManager.login.and.returnValue(of(buildResponse(rolesEnum.Administrador, false)));

    component.onSubmit();

    expect(component.error).toContain('Administrador');
  });

  it('debe mostrar error si el backend devuelve error', () => {
    component.formGroup.setValue({ email: 'fail@mail.com', password: '1234' });

    mockAuthManager.login.and.returnValue(throwError(() => ({
      error: { mssg: 'Credenciales inválidas' }
    })));

    component.onSubmit();

    expect(component.error).toEqual('Credenciales inválidas');
  });

  it('debe guardar access_token, refresh_token y user en sessionStorage', () => {
    const setItemSpy = spyOn(sessionStorage, 'setItem');
    component.formGroup.setValue({ email: 'test@mail.com', password: '1234' });

    mockAuthManager.login.and.returnValue(of(buildResponse(rolesEnum.Vendedor, false)));

    component.onSubmit();

    expect(setItemSpy).toHaveBeenCalledWith('access_token', 'abc');
    expect(setItemSpy).toHaveBeenCalledWith('refresh_token', 'def');
    expect(setItemSpy).toHaveBeenCalledWith('user', JSON.stringify({
      id: 'u1',
      email: 'test@mail.com',
      role: rolesEnum.Vendedor
    }));
  });
});
