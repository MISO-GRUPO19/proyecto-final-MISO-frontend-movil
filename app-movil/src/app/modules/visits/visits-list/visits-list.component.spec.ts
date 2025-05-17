import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { VisitsListComponent } from './visits-list.component';
import { VisitsManager } from '../services/visits.service';
import { SellerVisits, VisitList, VisitStatus } from '../models/visits.model';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  template: '<app-visits-list></app-visits-list>',
  imports: [VisitsListComponent]
})
class WrapperComponent { }

describe('VisitsListComponent (standalone with wrapper)', () => {
  let fixture: ComponentFixture<WrapperComponent>;
  let component: VisitsListComponent;
  let visitsManagerSpy: jasmine.SpyObj<VisitsManager>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockVisit: VisitList = {
    customer_name: 'Cliente A',
    customer_phonenumber: '3216549870',
    store_name: 'Tienda X',
    visit_address: 'Calle Falsa 123',
    visit_date: new Date('2025-05-10T10:00:00Z'),
    visit_id: 'visit-id-001',
    visit_status: VisitStatus.NO_VISITADO
  };

  const mockVisits: SellerVisits = {
    seller_id: '12345',
    visits_info: [mockVisit]
  };

  beforeEach(async () => {
    const visitsSpy = jasmine.createSpyObj('VisitsManager', ['getVisitsBySeller', 'changeStateVisit']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      snapshot: {
        paramMap: { get: () => null },
        queryParamMap: {
          get: () => null,
          has: () => false
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        WrapperComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: VisitsManager, useValue: visitsSpy },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    visitsManagerSpy = TestBed.inject(VisitsManager) as jasmine.SpyObj<VisitsManager>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorage.setItem('user', JSON.stringify({ id: '12345' }));

    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    visitsManagerSpy.getVisitsBySeller.and.returnValue(of(mockVisits));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería obtener visitas si hay un usuario en localStorage', () => {
    visitsManagerSpy.getVisitsBySeller.and.returnValue(of(mockVisits));
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
    fixture.detectChanges();

    expect(component.error).toBe('Error de red');
  });

  it('debería retornar clases CSS correctas según el estado', () => {
    expect(component.getTagClass('Próximo')).toBe('bg-orange-100 text-orange-800');
    expect(component.getTagClass(VisitStatus.NO_VISITADO)).toBe('bg-yellow-100 text-yellow-800');
    expect(component.getTagClass(VisitStatus.VISITADO)).toBe('bg-green-100 text-green-800');
    expect(component.getTagClass('Otro')).toBe('bg-gray-200 text-gray-800');
  });

  it('debería llamar changeStateVisit correctamente desde onVisitStatusClick', () => {
    visitsManagerSpy.changeStateVisit.and.returnValue(of({ message: 'Estado actualizado' }));
    component.onVisitStatusClick(mockVisit, VisitStatus.VISITADO);

    expect(visitsManagerSpy.changeStateVisit).toHaveBeenCalledWith('visit-id-001', { state: VisitStatus.VISITADO });
  });

  it('debería manejar errores en changeStateVisit', () => {
    visitsManagerSpy.changeStateVisit.and.returnValue(
      throwError(() => ({ error: { mssg: 'Error al cambiar estado' } }))
    );
    component.onVisitStatusClick(mockVisit, VisitStatus.VISITADO);

    expect(component.error).toBe('Error al cambiar estado');
  });

});
