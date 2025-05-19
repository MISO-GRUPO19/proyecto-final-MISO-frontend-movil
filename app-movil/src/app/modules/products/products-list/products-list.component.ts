import { Component, OnInit } from '@angular/core';
import { ProductsList, ProductsShoppingCar as ProductsShoppingCart } from '../../inventory/models/inventory.model';
import { ProductsManager } from '../../inventory/services/products.service';
import { ALLOWED_CATEGORIES, CATEGORY_IMAGES } from '../../inventory/models/categories.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { rolesEnum } from '../../../layout/roles.enum';
import { ClientsManager } from '../../clients/services/clients.service';
import { ClientsList, Store } from '../../clients/models/clients.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProductsListComponent implements OnInit {

  categorias: { name: string, img: string }[] = [];
  products: ProductsList[] = [];
  error: string | null = null;
  searchTerm = '';
  filteredProducts = [...this.products];
  clients: ClientsList[] = [];
  stores: Store[] = [];

  roleId?: number;
  roles = rolesEnum;

  constructor(private productsManager: ProductsManager, private clientsManager: ClientsManager) { }
  async ngOnInit() {
    await this.loadClients();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.roleId = user.role;
      if (this.roleId == rolesEnum.Cliente) {
        this.selectedClientId = user.id;
        this.loadClient(user.id);
      }
    }
    const storedClient = localStorage.getItem('selectedClient');
    if (storedClient) {
      const parsed = JSON.parse(storedClient);
      this.selectedClientId = parsed.id;
      this.selectedClientName = parsed.name;
      this.stores = parsed.stores;
      this.selectedStoreName = parsed.store?.store_address || null;
    }
    this.categorias = ALLOWED_CATEGORIES.map((categoria) => ({
      name: categoria,
      img: CATEGORY_IMAGES[categoria]
    }));
    this.fetchProducts();
  }

  fetchProducts() {
    this.productsManager.getProductsInventory().subscribe({
      next: (response: ProductsList[]) => {
        this.products = response;
        this.filteredProducts = [...this.products];
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.mssg || 'Error de autenticación';
      }
    });
  }

  selectedCategory: string | null = null;

  onSelecCategory(category: string): void {
    this.selectedCategory = category;
    this.filtrarProducts();
  }
  onSearch(): void {
    this.filtrarProducts();
  }

  filtrarProducts(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredProducts = this.products.filter(p => {
      const coincideTexto =
        p.name.toLowerCase().includes(term) ||
        p.barcode.includes(term);

      const coincideCategoria = this.selectedCategory
        ? p.category === this.selectedCategory
        : true;

      return coincideTexto && coincideCategoria;
    });
  }
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.filtrarProducts();
  }

  addToCart(product: ProductsList): void {
    const cartKey = 'cartItems';
    const cart: ProductsShoppingCart[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existing = cart.find(p => p.barcode === product.barcode);
    if (existing) {
      existing.quantity! += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert('Producto agregado al carrito');
  }

  loadClients(): void {
    this.clientsManager.getClients().subscribe({
      next: (response: ClientsList[]) => {
        this.clients = response;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.mssg || 'Error de autenticación';
      }
    });
  }

  loadClient(id: string): void {
    this.clients = [];
    this.clientsManager.getClientByIdAsync(id).subscribe({
      next: (client: ClientsList[]) => {
        if (client[0]) {
          this.stores = client[0].stores;
          var selectedStore = client[0].stores[0];
          this.selectedStoreName = selectedStore.store_name;
          localStorage.setItem('selectedClient', JSON.stringify({
            id: client[0].id,
            name: client[0].firstName + ' ' + client[0].lastName,
            stores: client[0].stores
          }));
          localStorage.setItem('selectedStore', JSON.stringify({
            id: selectedStore.store_address,
            name: selectedStore.store_name,
          }));
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.mssg || 'Error de autenticación';
      }
    });
  }


  selectedClientId: string | null = null;
  selectedStoreName: string | null = null;

  onSelectClient(): void {
    const client = this.clients.find(c => c.id === this.selectedClientId);
    if (client) {
      this.stores = client.stores;
      this.selectedStoreName = null;
      localStorage.setItem('selectedClient', JSON.stringify({
        id: client.id,
        name: client.firstName + ' ' + client.lastName,
        stores: client.stores
      }));
    }
  }

  onSelectStore(): void {
    const selectedStore = this.stores.find(s => s.store_name === this.selectedStoreName);
    if (selectedStore) {
      localStorage.setItem('selectedStore', JSON.stringify({
        id: selectedStore.store_address,
        name: selectedStore.store_name,
      }));
    }
  }

  clientDropdownOpen = false;
  selectedClientName: string | null = null;

  toggleClientDropdown(): void {
    this.clientDropdownOpen = !this.clientDropdownOpen;
  }

  selectClient(client: ClientsList): void {
    this.selectedClientId = client.id;
    this.selectedClientName = client.firstName + ' ' + client.lastName;
    this.stores = client.stores;
    this.clientDropdownOpen = false;

    localStorage.setItem('selectedClient', JSON.stringify({
      id: client.id,
      name: client.firstName + ' ' + client.lastName,
      store: client.stores?.[0]
    }));

    this.selectedStoreName = client.stores?.[0]?.store_name || null;
  }
}