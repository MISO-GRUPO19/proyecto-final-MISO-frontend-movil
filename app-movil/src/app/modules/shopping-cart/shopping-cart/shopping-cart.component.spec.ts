import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OrdersManager } from '../../deliveries/services/deliveries.service';
import { ProductsShoppingCar } from '../../inventory/models/inventory.model';
import { rolesEnum } from '../../../layout/roles.enum';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let mockOrdersManager: jasmine.SpyObj<OrdersManager>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCartItems: ProductsShoppingCar[] = [
    { barcode: '123', name: 'Producto A', price: 100, quantity: 2, stock: 10, category: 'General' },
    { barcode: '456', name: 'Producto B', price: 50, quantity: 1, stock: 5, category: 'General' },
  ];

  beforeEach(async () => {
    mockOrdersManager = jasmine.createSpyObj('OrdersManager', ['createOrder']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ShoppingCartComponent],
      providers: [
        { provide: OrdersManager, useValue: mockOrdersManager },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      switch (key) {
        case 'cartItems':
          return JSON.stringify(mockCartItems);
        case 'user':
          return JSON.stringify({ role: rolesEnum.Vendedor });
        case 'selectedClient':
          return JSON.stringify({ id: 'C001', name: 'Cliente X' });
        case 'selectedStore':
          return JSON.stringify({ name: 'Tienda Y' });
        default:
          return null;
      }
    });
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    fixture.detectChanges();
  });

  it('debería enviar pedido y redirigir con mensaje de vendedor', () => {
    mockOrdersManager.createOrder.and.returnValue(of({
      client_id: 'C001',
      date: new Date(),
      total: 250,
      type: 'CLIENTE',
      products: [
        { barcode: '123', quantity: 2 },
        { barcode: '456', quantity: 1 }
      ]
    }));

    component.submitOrder();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loading'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        title: 'Pedido realizado con exito',
        message: 'El pedido para el cliente Cliente X fue creado con éxito para su tienda Tienda Y'
      })
    }));
  });
});
