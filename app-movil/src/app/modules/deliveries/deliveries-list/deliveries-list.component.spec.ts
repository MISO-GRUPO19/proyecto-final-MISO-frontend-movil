import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeliveriesListComponent } from './deliveries-list.component';
import { OrdersManager } from '../services/deliveries.service';
import { OrderResponse } from '../models/deliveries.model';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('DeliveriesListComponent', () => {
  let component: DeliveriesListComponent;
  let fixture: ComponentFixture<DeliveriesListComponent>;
  let mockOrdersManager: jasmine.SpyObj<OrdersManager>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockOrders: OrderResponse[] = [
    {
      id: '1',
      code: 'ORD001',
      client_id: '123',
      seller_id: '999',
      seller_info: {
        name: 'Vendedor Uno',
        email: 'vendedor@tienda.com',
        country: 'Colombia',
        address: 'Carrera 1',
        identification: 'CC123',
        telephone: '3000000000',
      },
      date_order: '2025-04-22T10:00:00Z',
      provider_id: 'prov-01',
      total: 50000,
      type: 'Normal',
      state: 'ENPROCESO',
      route_id: 'route-1',
      products: [
        { name: 'Producto A', barcode: '1234567890', quantity: 2 }
      ],
      status_history: [
        { status: 'PENDIENTE', timestamp: '2025-04-20T09:00:00Z' },
        { status: 'ENPROCESO', timestamp: '2025-04-21T11:00:00Z' }
      ]
    }
  ];

  beforeEach(waitForAsync(() => {
    const ordersSpy = jasmine.createSpyObj('OrdersManager', ['getOrdersByClient']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [DeliveriesListComponent, CommonModule],
      providers: [
        { provide: OrdersManager, useValue: ordersSpy },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    mockOrdersManager = TestBed.inject(OrdersManager) as jasmine.SpyObj<OrdersManager>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  beforeEach(() => {
    sessionStorage.clear(); // Limpiar antes de cada test
    fixture = TestBed.createComponent(DeliveriesListComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar clientId desde sessionStorage y llamar fetchDeliveries', () => {
    const user = { id: '123' };
    sessionStorage.setItem('user', JSON.stringify(user));
    mockOrdersManager.getOrdersByClient.and.returnValue(of(mockOrders));

    component.ngOnInit();

    expect(component.clientId).toBe('123');
    expect(mockOrdersManager.getOrdersByClient).toHaveBeenCalledWith('123');
    expect(component.deliveries.length).toBe(1);
  });

  it('no debería llamar fetchDeliveries si no hay clientId', () => {
    sessionStorage.removeItem('user');
    component.ngOnInit();
    expect(component.clientId).toBeNull();
    expect(mockOrdersManager.getOrdersByClient).not.toHaveBeenCalled();
  });

  it('debería manejar error de servicio correctamente', () => {
    const consoleSpy = spyOn(console, 'error');
    const user = { id: '123' };
    sessionStorage.setItem('user', JSON.stringify(user));

    mockOrdersManager.getOrdersByClient.and.returnValue(
      throwError(() => ({ error: 'Error de red' }))
    );

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalled();
  });
});
