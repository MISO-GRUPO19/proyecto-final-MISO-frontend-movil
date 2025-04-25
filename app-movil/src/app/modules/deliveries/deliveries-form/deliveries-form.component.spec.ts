import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeliveriesFormComponent } from './deliveries-form.component';
import { OrdersManager } from '../services/deliveries.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OrderResponse } from '../models/deliveries.model';
import { CommonModule } from '@angular/common';

describe('DeliveriesFormComponent', () => {
  let component: DeliveriesFormComponent;
  let fixture: ComponentFixture<DeliveriesFormComponent>;
  let mockOrdersManager: jasmine.SpyObj<OrdersManager>;

  const mockOrder: OrderResponse = {
    id: '1',
    code: 'ORD123',
    client_id: 'CL001',
    seller_id: 'SL001',
    seller_info: {
      name: 'Carlos Pérez',
      email: 'carlos@ventas.com',
      country: 'Colombia',
      address: 'Calle Falsa 123',
      identification: '1234567890',
      telephone: '3001234567',
    },
    date_order: '2025-04-22T10:00:00Z',
    provider_id: 'PRV001',
    total: 35000,
    type: 'Express',
    state: 'ENTREGADO',
    route_id: 'route-9',
    products: [
      { name: 'Producto X', barcode: '999000111222', quantity: 3 }
    ],
    status_history: [
      { status: 'PENDIENTE', timestamp: '2025-04-21T08:00:00Z' },
      { status: 'ENTREGADO', timestamp: '2025-04-22T10:00:00Z' }
    ]
  };

  beforeEach(waitForAsync(() => {
    const ordersSpy = jasmine.createSpyObj('OrdersManager', ['getOrdersById']);

    TestBed.configureTestingModule({
      imports: [DeliveriesFormComponent, CommonModule],
      providers: [
        { provide: OrdersManager, useValue: ordersSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? '1' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    mockOrdersManager = TestBed.inject(OrdersManager) as jasmine.SpyObj<OrdersManager>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveriesFormComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener el deliveryId desde route y cargar datos', () => {
    mockOrdersManager.getOrdersById.and.returnValue(of([mockOrder]));

    component.ngOnInit();

    expect(component.deliveryId).toBe('1');
    expect(mockOrdersManager.getOrdersById).toHaveBeenCalledWith('1');
    expect(component.delivery).toEqual(mockOrder);
  });

  it('debería manejar errores del servicio', () => {
    const consoleSpy = spyOn(console, 'error');
    mockOrdersManager.getOrdersById.and.returnValue(
      throwError(() => ({ error: 'Error en backend' }))
    );

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalled();
    expect(component.delivery).toBeNull();
  });
});
