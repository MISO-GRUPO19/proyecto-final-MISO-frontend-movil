import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OrdersManager } from '../../deliveries/services/deliveries.service';
import { ProductsShoppingCar } from '../../inventory/models/inventory.model';
import { rolesEnum } from '../../../layout/roles.enum';
import { TranslateModule } from '@ngx-translate/core'; // 👈 Añadir
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      imports: [
        ShoppingCartComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(), // 👈 Importante
      ],
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
    (localStorage.getItem as jasmine.Spy).withArgs('selectedClient').and.returnValue(null);

    component.submitOrder();

    expect(window.alert).toHaveBeenCalledWith('Por favor seleccione un cliente');
  });

  it('debería manejar error si createOrder falla', () => {
    const consoleSpy = spyOn(console, 'error');
    mockOrdersManager.createOrder.and.returnValue(throwError(() => new Error('Error al crear pedido')));

    component.submitOrder();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
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
