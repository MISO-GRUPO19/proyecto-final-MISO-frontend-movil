import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LoadingComponent', () => {
    let component: LoadingComponent;
    let fixture: ComponentFixture<LoadingComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadingComponent],
            providers: [
                provideRouter([]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({
                            title: '¡Bienvenido!',
                            message: 'Registro completado',
                            redirectTo: '/home'
                        })
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should update title, message, and redirectTo from queryParams', () => {
        expect(component.title).toBe('¡Bienvenido!');
        expect(component.message).toBe('Registro completado');
        expect(component.redirectTo).toBe('/home');
    });

    it('should call goToNext after 3 seconds', fakeAsync(() => {
        spyOn(component, 'goToNext');
        component.ngOnInit();
        tick(3000);
        expect(component.goToNext).toHaveBeenCalled();
    }));

    it('should navigate to redirectTo path on goToNext', () => {
        component.redirectTo = '/somewhere';
        component.goToNext();
        expect(router.navigate).toHaveBeenCalledWith(['/somewhere']);
    });
});
