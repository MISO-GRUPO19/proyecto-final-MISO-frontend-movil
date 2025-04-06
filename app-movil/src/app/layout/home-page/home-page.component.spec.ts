import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HomePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set roleId if user data exists in sessionStorage', () => {
    const mockUser = { role: 2 }; // Simula un rol de usuario
    sessionStorage.setItem('user', JSON.stringify(mockUser));

    component.ngOnInit();

    expect(component.roleId).toBe(mockUser.role);
  });

  it('should not set roleId if no user data exists in sessionStorage', () => {
    sessionStorage.removeItem('user');
    
    component.ngOnInit();

    expect(component.roleId).toBeUndefined();
  });
});