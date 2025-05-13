import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitsListComponent } from './visits-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { VisitsManager } from '../services/visits.service';
import { SellerVisits } from '../models/visits.model';

describe('VisitsListComponent', () => {
  let component: VisitsListComponent;
  let fixture: ComponentFixture<VisitsListComponent>;
  let visitsManagerSpy: jasmine.SpyObj<VisitsManager>;

  const mockVisits: SellerVisits = {
    seller_id: '12345',
    visits_info: [
      {
        customer_name: 'Cliente A',
        customer_phonenumber: '3216549870',
        store_name: 'Tienda X',
        visit_address: 'Calle Falsa 123',
        visit_date: new Date('2025-05-10T10:00:00Z'),
        visit_id: 'visit-id-001',
        visit_status: 'NO_VISITADO'
      }
    ]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('VisitsManager', ['getVisitsBySeller']);

    await TestBed.configureTestingModule({
      imports: [
        VisitsListComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: VisitsManager, useValue: spy }
      ]
    }).compileComponents();

    visitsManagerSpy = TestBed.inject(VisitsManager) as jasmine.SpyObj<VisitsManager>;
    localStorage.setItem('user', JSON.stringify({ id: '12345' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    visitsManagerSpy.getVisitsBySeller.and.returnValue(of(mockVisits));
    fixture = TestBed.createComponent(VisitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería obtener visitas si hay un usuario en localStorage', () => {
    visitsManagerSpy.getVisitsBySeller.and.returnValue(of(mockVisits));
    fixture = TestBed.createComponent(VisitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(visitsManagerSpy.getVisitsBySeller).toHaveBeenCalledWith('12345');
    expect(component.visits.length).toBe(1);
    expect(component.visits[0].customer_name).toBe('Cliente A');
    expect(component.error).toBeNull();
  });

  it('debería manejar error cuando falla getVisitsBySeller', () => {
    visitsManagerSpy.getVisitsBySeller.and.returnValue(
      throwError(() => ({ error: { mssg: 'Error de red' } }))
    );
    fixture = TestBed.createComponent(VisitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBe('Error de red');
  });

  it('debería retornar clases CSS correctas según el estado', () => {
    fixture = TestBed.createComponent(VisitsListComponent);
    component = fixture.componentInstance;

    expect(component.getTagClass('Próximo')).toBe('bg-orange-100 text-orange-800');
    expect(component.getTagClass('Más tarde')).toBe('bg-yellow-100 text-yellow-800');
    expect(component.getTagClass('Visitado')).toBe('bg-green-100 text-green-800');
    expect(component.getTagClass('Otro')).toBe('bg-gray-200 text-gray-800');
  });
});
