import { OrdersManager } from './../../deliveries/services/deliveries.service';
import { Component, OnInit } from '@angular/core';
import { ProductsShoppingCar } from '../../inventory/models/inventory.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { rolesEnum } from '../../../layout/roles.enum';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: ProductsShoppingCar[] = [];
  roleId?: number;
  clientName: string | null = null;
  storeName: string | null = null;
  clientId?: string;
  sellerId?: string;
  roles = rolesEnum;
  constructor(private ordersManager: OrdersManager, private router: Router, private translateService: TranslateService) { }

  ngOnInit() {
    this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.sellerId = user.id;
      this.roleId = user.role;
        if (this.roleId == rolesEnum.Cliente) {
        this.clientId = user.id
      }
    }
    const storedClient = localStorage.getItem('selectedClient');
    if (storedClient) {
      const clientData = JSON.parse(storedClient);
      this.clientId = clientData.id;
      this.clientName = clientData.name || null;
    }
    const selectedStore = localStorage.getItem('selectedStore');
    if (selectedStore) {
      const storeData = JSON.parse(selectedStore);
      this.storeName = storeData.name;
    }
  }

  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increaseQuantity(item: ProductsShoppingCar) {
    item.quantity += 1;
    this.updateCartStorage();
  }

  decreaseQuantity(item: ProductsShoppingCar) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateCartStorage();
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: ProductsShoppingCar) {
    this.cartItems = this.cartItems.filter(p => p.barcode !== item.barcode);
    this.updateCartStorage();
  }

  updateCartStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  submitOrder() {
    if (!this.clientId) {
      alert('Por favor seleccione un cliente');
      return;
    }
    this.ordersManager.createOrder({
      client_id: this.clientId ?? '',
      date: new Date(),
      total: this.total,
      type: 'CLIENTE',
      seller_id: this.roleId == rolesEnum.Vendedor ? this.sellerId ?? '' : '',
      products: this.cartItems.map(item => ({
        barcode: item.barcode,
        quantity: item.quantity
      }))
    }).subscribe({
      next: (response) => {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('selectedClient');
        localStorage.removeItem('selectedStore');
        this.router.navigate(['/loading'], {
          queryParams: {
            title: this.roleId == rolesEnum.Cliente ? 'Pedido realizado con éxito' : 'Pedido realizado con exito',
            message: this.roleId == rolesEnum.Cliente ? 'Tu pedido fue creado con exito' : 'El pedido para el cliente ' + this.clientName + ' fue creado con éxito para su tienda ' + this.storeName,
            redirectTo: '/home/shopping-cart',
            clearSession: false
          }
        });
      },
      error: (err) => {
        const key = err.error?.error;
        const errorMessage = key && key.trim() !== ''
          ? this.translateService.instant(key)
          : 'Error de órdenes'; alert(errorMessage + ' ' + err.error?.barcode);
        console.error(err);
      }
    });
  }
}
