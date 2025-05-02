import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';
import { rolesEnum } from '../roles.enum';

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let router: Router;
    let routerEvents$: Subject<any>;

    beforeEach(async () => {
        routerEvents$ = new Subject<NavigationEnd>();

        await TestBed.configureTestingModule({
            imports: [HomePageComponent],
            providers: [
                provideRouter([]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            data: { title: 'Título prueba' }
                        },
                        firstChild: null
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        spyOnProperty(router, 'events', 'get').and.returnValue(routerEvents$.asObservable());
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should set pageTitle from ActivatedRoute snapshot data', () => {
        component.ngOnInit();
        expect(component.pageTitle).toBe('Título prueba');
    });

    it('should update title on NavigationEnd event', () => {
        component.ngOnInit();
        routerEvents$.next(new NavigationEnd(1, '/home', '/home'));
        expect(component.pageTitle).toBe('Título prueba');
    });

    it('should get roleId from localStorage', () => {
        const mockUser = { role: rolesEnum.Vendedor };
        localStorage.setItem('user', JSON.stringify(mockUser));
        component.ngOnInit();
        expect(component.roleId).toBe(rolesEnum.Vendedor);
    });

    it('should remove user data and navigate to /auth/login on logout()', () => {
        localStorage.setItem('access_token', '123');
        localStorage.setItem('refresh_token', '456');
        localStorage.setItem('user', JSON.stringify({}));

        component.logout();

        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
});
