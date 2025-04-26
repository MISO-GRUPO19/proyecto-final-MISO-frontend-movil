import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { Router, ActivatedRoute, NavigationEnd, UrlTree } from '@angular/router';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let routerEvents$: Subject<any>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        routerEvents$ = new Subject<NavigationEnd>();

        mockRouter = jasmine.createSpyObj<Router>(
            'Router',
            ['navigate', 'createUrlTree', 'serializeUrl'],
            {
                events: routerEvents$.asObservable(),
                createUrlTree: jasmine.createSpy().and.returnValue({} as UrlTree),
                serializeUrl: jasmine.createSpy().and.returnValue('/mock-url')
            }
        );

        mockActivatedRoute = {
            snapshot: { data: {} },
            firstChild: null
        };

        await TestBed.configureTestingModule({
            imports: [HomePageComponent, CommonModule],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe establecer el roleId desde sessionStorage si está disponible', () => {
        sessionStorage.setItem('user', JSON.stringify({ role: 1 }));
        component.ngOnInit();
        expect(component.roleId).toBe(1);
    });

    it('debe establecer pageTitle como "Inicio" si no hay título en la ruta', () => {
        (component as any).updatePageTitle();
        expect(component.pageTitle).toBe('Inicio');
    });

    it('debe establecer pageTitle desde el data de la ruta más profunda', () => {
        const child = {
            snapshot: {
                data: { title: 'Mi Título' }
            },
            firstChild: null
        };
        mockActivatedRoute.firstChild = child;

        (component as any).updatePageTitle();
        expect(component.pageTitle).toBe('Mi Título');
    });

    it('debe actualizar el título al detectar un NavigationEnd', () => {
        const spy = spyOn<any>(component, 'updatePageTitle');
        routerEvents$.next(new NavigationEnd(1, '/home', '/home'));
        expect(spy).toHaveBeenCalled();
    });

    it('debe limpiar sessionStorage y redirigir al login al hacer logout', () => {
        const spy = spyOn(sessionStorage, 'removeItem');
        component.logout();

        expect(spy).toHaveBeenCalledWith('access_token');
        expect(spy).toHaveBeenCalledWith('refresh_token');
        expect(spy).toHaveBeenCalledWith('user');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
});
