import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginInComponent } from './login-in.component';

describe('LoginInComponent', () => {
  let component: LoginInComponent;
  let fixture: ComponentFixture<LoginInComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), LoginInComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
