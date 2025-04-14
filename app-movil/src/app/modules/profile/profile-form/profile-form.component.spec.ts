import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileFormComponent } from './profile-form.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { AuthManager } from '../../../layout/auth/services/auth.service';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authManagerSpy: jasmine.SpyObj<AuthManager>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authManagerSpy = jasmine.createSpyObj('AuthManager', ['createCustomers']);

    await TestBed.configureTestingModule({
      imports: [ProfileFormComponent],
      providers: [
        RxFormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ params: { email: 'test@correo.com' } }) } },
        { provide: AuthManager, useValue: authManagerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar el email desde los parámetros de la ruta', () => {
    expect(component.email).toBe('test@correo.com');
  });

  it('no debe enviar el formulario si es inválido', () => {
    spyOnProperty(component.formGroup, 'invalid', 'get').and.returnValue(true);
    component.onSubmit();
    expect(authManagerSpy.createCustomers).not.toHaveBeenCalled();
  });

  it('debe enviar los datos si el formulario es válido', fakeAsync(() => {
    component.formGroup.controls.name.setValue('Lucia');
    component.formGroup.controls.lastName.setValue('Colorado');
    component.formGroup.controls.country.setValue('Colombia');
    component.formGroup.controls.address.setValue('Calle Falsa 123');
    component.formGroup.controls.telphone.setValue('3001234567');
    component.email = 'lucia@correo.com';

    authManagerSpy.createCustomers.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(authManagerSpy.createCustomers).toHaveBeenCalledWith({
      firstName: 'Lucia',
      lastName: 'Colorado',
      country: 'Colombia',
      address: 'Calle Falsa 123',
      phoneNumber: 3001234567,
      email: 'lucia@correo.com'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('debe manejar errores al enviar datos', fakeAsync(() => {
    component.formGroup.controls.name.setValue('Lucia');
    component.formGroup.controls.lastName.setValue('Colorado');
    component.formGroup.controls.country.setValue('Colombia');
    component.formGroup.controls.address.setValue('Calle Falsa 123');
    component.formGroup.controls.telphone.setValue('3001234567');
    component.email = 'lucia@correo.com';

    const mockError = { error: { message: 'Error del servidor' } };
    authManagerSpy.createCustomers.and.returnValue(throwError(mockError));

    component.onSubmit();
    tick();

    expect(component.error).toBe('Error del servidor');
  }));
});
