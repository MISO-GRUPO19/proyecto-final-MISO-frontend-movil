import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BaseAuthComponent } from './base-auth.component';

describe('BaseAuthComponent', () => {
  let component: BaseAuthComponent;
  let fixture: ComponentFixture<BaseAuthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), BaseAuthComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: new Map() }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
