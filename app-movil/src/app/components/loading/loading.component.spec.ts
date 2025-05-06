import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let router: Router;

  function createComponentWithParams(params: any) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        queryParams: of(params)
      }
    });

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    createComponentWithParams({});
    expect(component).toBeTruthy();
  });

  it('should use default values if no queryParams are provided', () => {
    createComponentWithParams({});
    expect(component.title).toBe('Registro exitoso');
    expect(component.message).toBe('Tu cuenta fue creada con éxito.');
    expect(component.redirectTo).toBe('/auth/login');
  });

  it('should override title, message, and redirectTo from queryParams', () => {
    createComponentWithParams({
      title: '¡Bienvenido!',
      message: 'Registro completado',
      redirectTo: '/home'
    });
    expect(component.title).toBe('¡Bienvenido!');
    expect(component.message).toBe('Registro completado');
    expect(component.redirectTo).toBe('/home');
  });

  it('should use default title if only message and redirectTo are provided', () => {
    createComponentWithParams({
      message: 'Solo mensaje',
      redirectTo: '/dashboard'
    });
    expect(component.title).toBe('Registro exitoso');
    expect(component.message).toBe('Solo mensaje');
    expect(component.redirectTo).toBe('/dashboard');
  });

  it('should use default message if only title and redirectTo are provided', () => {
    createComponentWithParams({
      title: 'Solo título',
      redirectTo: '/dashboard'
    });
    expect(component.title).toBe('Solo título');
    expect(component.message).toBe('Tu cuenta fue creada con éxito.');
    expect(component.redirectTo).toBe('/dashboard');
  });

  it('should use default redirectTo if only title and message are provided', () => {
    createComponentWithParams({
      title: 'Otro título',
      message: 'Otro mensaje'
    });
    expect(component.title).toBe('Otro título');
    expect(component.message).toBe('Otro mensaje');
    expect(component.redirectTo).toBe('/auth/login');
  });

  it('should call goToNext after 3 seconds', fakeAsync(() => {
    createComponentWithParams({});
    spyOn(component, 'goToNext');
    component.ngOnInit();
    tick(3000);
    expect(component.goToNext).toHaveBeenCalled();
  }));

  it('should navigate to redirectTo path on goToNext', () => {
    createComponentWithParams({});
    component.redirectTo = '/somewhere';
    component.goToNext();
    expect(router.navigate).toHaveBeenCalledWith(['/somewhere']);
  });
});
