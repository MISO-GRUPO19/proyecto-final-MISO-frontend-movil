import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OrdersManager } from '../../deliveries/services/deliveries.service';
import { ProductsShoppingCar } from '../../inventory/models/inventory.model';
import { rolesEnum } from '../../../layout/roles.enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderPayload } from '../models/shopping-cart.model';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let mockOrdersManager: jasmine.SpyObj<OrdersManager>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  const mockCartItems: ProductsShoppingCar[] = [
    { barcode: '123', name: 'Producto A', price: 100, quantity: 2, stock: 10, category: 'General' },
    { barcode: '456', name: 'Producto B', price: 50, quantity: 1, stock: 5, category: 'General' },
  ];

  const mockOrderPayload: OrderPayload = {
    client_id: 'C001',
    date: new Date(),
    total: 250,
    type: 'CLIENTE',
    seller_id: 'V001',
    products: [
      { barcode: '123', quantity: 2 },
      { barcode: '456', quantity: 1 }
    ]
  };

  beforeEach(async () => {
    mockOrdersManager = jasmine.createSpyObj('OrdersManager', ['createOrder']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake((key: string) => key + '_translated');

    await TestBed.configureTestingModule({
      imports: [
        ShoppingCartComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: OrdersManager, useValue: mockOrdersManager },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      switch (key) {
        case 'cartItems':
          return JSON.stringify(mockCartItems);
        case 'user':
          return JSON.stringify({ id: 'V001', role: rolesEnum.Vendedor });
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

  it('debería inicializar cartItems desde localStorage', () => {
    expect(component.cartItems.length).toBe(2);
    expect(component.roleId).toBe(rolesEnum.Vendedor);
    expect(component.clientName).toBe('Cliente X');
    expect(component.storeName).toBe('Tienda Y');
  });

  it('debería calcular el total correctamente', () => {
    expect(component.total).toBe(250);
  });

  it('debería aumentar la cantidad de un ítem', () => {
    const item = component.cartItems[0];
    component.increaseQuantity(item);
    expect(item.quantity).toBe(3);
  });

  it('debería disminuir la cantidad de un ítem mayor a 1', () => {
    const item = component.cartItems[0];
    component.decreaseQuantity(item);
    expect(item.quantity).toBe(1);
  });

  it('debería eliminar el ítem si la cantidad es 1 y se disminuye', () => {
    const item = component.cartItems[1];
    component.decreaseQuantity(item);
    expect(component.cartItems.find(i => i.barcode === item.barcode)).toBeUndefined();
  });

  it('debería eliminar un ítem del carrito', () => {
    component.removeItem(mockCartItems[0]);
    expect(component.cartItems.length).toBe(1);
  });

  it('debería actualizar el almacenamiento al modificar el carrito', () => {
    component.updateCartStorage();
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', jasmine.any(String));
  });

  it('debería alertar si no hay cliente seleccionado', () => {
    spyOn(window, 'alert');
    component.clientId = undefined;
    component.submitOrder();
    expect(window.alert).toHaveBeenCalledWith('Por favor seleccione un cliente');
  });

  it('debería manejar error si createOrder falla', () => {
    const consoleSpy = spyOn(console, 'error');
    mockOrdersManager.createOrder.and.returnValue(throwError(() => new Error('Error al crear pedido')));
    component.submitOrder();
    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('debería traducir el mensaje de error si existe clave', () => {
    mockOrdersManager.createOrder.and.returnValue(throwError(() => ({
      error: { error: 'ERROR_KEY', barcode: '123' }
    })));
    spyOn(window, 'alert');
    component.submitOrder();
    expect(translateSpy.instant).toHaveBeenCalledWith('ERROR_KEY');
    expect(window.alert).toHaveBeenCalledWith('ERROR_KEY_translated 123');
  });

  it('debería enviar pedido y redirigir con mensaje de vendedor', () => {
    mockOrdersManager.createOrder.and.returnValue(of(mockOrderPayload));
    component.submitOrder();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loading'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        title: 'Pedido realizado con exito',
        message: 'El pedido para el cliente Cliente X fue creado con éxito para su tienda Tienda Y'
      })
    }));
  });

  it('debería limpiar localStorage tras enviar el pedido', () => {
    mockOrdersManager.createOrder.and.returnValue(of(mockOrderPayload));
    component.submitOrder();
    expect(localStorage.removeItem).toHaveBeenCalledWith('cartItems');
    expect(localStorage.removeItem).toHaveBeenCalledWith('selectedClient');
    expect(localStorage.removeItem).toHaveBeenCalledWith('selectedStore');
  });

  it('debería construir los productos correctamente en el pedido', () => {
    mockOrdersManager.createOrder.and.callFake((order) => {
      expect(order.products).toEqual([
        { barcode: '123', quantity: 2 },
        { barcode: '456', quantity: 1 }
      ]);
      return of(mockOrderPayload);
    });
    component.submitOrder();
  });

  it('no debería incluir seller_id si el rol no es Vendedor', () => {
    component.roleId = rolesEnum.Cliente;
    component.clientId = 'C001';
    spyOnProperty(component, 'total').and.returnValue(250);

    mockOrdersManager.createOrder.and.callFake((order) => {
      expect(order.seller_id).toBe('');
      return of(mockOrderPayload);
    });

    component.submitOrder();
  });

  it('debería enviar pedido y redirigir con mensaje de cliente', () => {
    component.roleId = rolesEnum.Cliente;
    component.clientId = 'C001';
    component.clientName = 'Cliente X';
    component.storeName = 'Tienda Y';
    mockOrdersManager.createOrder.and.returnValue(of(mockOrderPayload));

    component.submitOrder();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loading'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        title: 'Pedido realizado con éxito',
        message: 'Tu pedido fue creado con exito'
      })
    }));
  });
});
