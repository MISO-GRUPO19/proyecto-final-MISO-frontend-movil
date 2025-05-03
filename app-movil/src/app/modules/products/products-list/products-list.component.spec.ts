import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { ProductsManager } from '../../inventory/services/products.service';
import { ClientsManager } from '../../clients/services/clients.service';
import { of, throwError } from 'rxjs';
import { ProductsList } from '../../inventory/models/inventory.model';
import { ClientsList } from '../../clients/models/clients.model';

describe('ProductsListComponent', () => {
    let component: ProductsListComponent;
    let fixture: ComponentFixture<ProductsListComponent>;
    let productsManagerMock: jasmine.SpyObj<ProductsManager>;
    let clientsManagerMock: jasmine.SpyObj<ClientsManager>;

    const mockProducts: ProductsList[] = [
        { name: 'Camiseta', barcode: '123', stock: 10, price: 100, category: 'Ropa' },
        { name: 'Zapato', barcode: '456', stock: 5, price: 250, category: 'Calzado' }
    ];

    const mockClients: ClientsList[] = [
        {
            id: '1', firstName: 'Juan', lastName: 'Pérez', stores: [{ store_name: 'Tienda 1', store_address: 'Calle 1' }],
            country: '',
            address: '',
            email: '',
            phoneNumber: ''
        }
    ];

    beforeEach(async () => {
        productsManagerMock = jasmine.createSpyObj('ProductsManager', ['getProductsInventory']);
        clientsManagerMock = jasmine.createSpyObj('ClientsManager', ['getClients', 'getClientByIdAsync']);

        await TestBed.configureTestingModule({
            imports: [ProductsListComponent],
            providers: [
                { provide: ProductsManager, useValue: productsManagerMock },
                { provide: ClientsManager, useValue: clientsManagerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductsListComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load and filter products correctly', () => {
        productsManagerMock.getProductsInventory.and.returnValue(of(mockProducts));

        component.fetchProducts();

        expect(component.products.length).toBe(2);

        component.searchTerm = 'zapa';
        component.onSearch();
        expect(component.filteredProducts.length).toBe(1);
        expect(component.filteredProducts[0].name).toBe('Zapato');
    });

    it('should handle product service error', () => {
        productsManagerMock.getProductsInventory.and.returnValue(throwError(() => ({
            error: { mssg: 'Error desde el backend' }
        })));

        component.fetchProducts();
        expect(component.error).toBe('Error desde el backend');
    });

    it('should add product to cart', () => {
        const product = mockProducts[0];
        localStorage.clear();
        component.addToCart(product);
        const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        expect(savedCart.length).toBe(1);
        expect(savedCart[0].barcode).toBe(product.barcode);
        expect(savedCart[0].quantity).toBe(1);
    });

    it('should load clients on init', () => {
        clientsManagerMock.getClients.and.returnValue(of(mockClients));
        component.loadClients();
        expect(component.clients.length).toBe(1);
        expect(component.clients[0].firstName).toBe('Juan');
    });

    it('should handle clients service error', () => {
        clientsManagerMock.getClients.and.returnValue(throwError(() => ({
            error: { mssg: 'Fallo en carga de clientes' }
        })));
        component.loadClients();
        expect(component.error).toBe('Fallo en carga de clientes');
    });

    it('should toggle client dropdown', () => {
        expect(component.clientDropdownOpen).toBeFalse();
        component.toggleClientDropdown();
        expect(component.clientDropdownOpen).toBeTrue();
    });

    it('should select a client and update localStorage', () => {
        const client = mockClients[0];
        component.selectClient(client);

        expect(component.selectedClientId).toBe(client.id);
        expect(component.selectedClientName).toBe(`${client.firstName} ${client.lastName}`);
        expect(component.clientDropdownOpen).toBeFalse();

        const stored = JSON.parse(localStorage.getItem('selectedClient') || '{}');
        expect(stored.id).toBe(client.id);
        expect(stored.name).toBe(`${client.firstName} ${client.lastName}`);
        expect(stored.store.store_name).toBe(client.stores[0].store_name);
    });

    it('should handle onSelectClient()', () => {
        component.clients = [...mockClients];
        component.selectedClientId = '1';
        component.onSelectClient();

        const stored = JSON.parse(localStorage.getItem('selectedClient') || '{}');
        expect(stored.id).toBe('1');
        expect(stored.stores.length).toBe(1);
    });

    it('should handle onSelectStore()', () => {
        component.stores = mockClients[0].stores;
        component.selectedStoreName = 'Tienda 1';
        component.onSelectStore();

        const store = JSON.parse(localStorage.getItem('selectedStore') || '{}');
        expect(store.name).toBe('Tienda 1');
    });

    it('should load a client by ID and set store info', () => {
        clientsManagerMock.getClientByIdAsync.and.returnValue(of([mockClients[0]]));
        component.loadClient('1');

        expect(component.stores.length).toBe(1);
        const storedClient = JSON.parse(localStorage.getItem('selectedClient') || '{}');
        const storedStore = JSON.parse(localStorage.getItem('selectedStore') || '{}');

        expect(storedClient.name).toBe('Juan Pérez');
        expect(storedStore.name).toBe('Tienda 1');
    });
});


describe('Additional Tests for ProductsListComponent', () => {
    let component: ProductsListComponent;
    let fixture: ComponentFixture<ProductsListComponent>;
    let productsManagerMock: jasmine.SpyObj<ProductsManager>;
    let clientsManagerMock: jasmine.SpyObj<ClientsManager>;

    const mockProducts: ProductsList[] = [
        { name: 'Camiseta', barcode: '123', stock: 10, price: 100, category: 'Ropa' },
        { name: 'Zapato', barcode: '456', stock: 5, price: 250, category: 'Calzado' }
    ];

    const mockClients: ClientsList[] = [
        {
            id: '1', firstName: 'Juan', lastName: 'Pérez', stores: [{ store_name: 'Tienda 1', store_address: 'Calle 1' }],
            country: '', address: '', email: '', phoneNumber: ''
        }
    ];

    beforeEach(async () => {
        productsManagerMock = jasmine.createSpyObj('ProductsManager', ['getProductsInventory']);
        clientsManagerMock = jasmine.createSpyObj('ClientsManager', ['getClients', 'getClientByIdAsync']);

        await TestBed.configureTestingModule({
            imports: [ProductsListComponent],
            providers: [
                { provide: ProductsManager, useValue: productsManagerMock },
                { provide: ClientsManager, useValue: clientsManagerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductsListComponent);
        component = fixture.componentInstance;
        localStorage.clear(); // Limpiar localStorage antes de cada test
    });

    afterEach(() => {
        localStorage.clear(); // Limpiar localStorage después de cada test
    });

    it('should load stored client data from localStorage on init', async () => {
        const storedClient = {
            id: '1',
            name: 'Juan Pérez',
            stores: mockClients[0].stores,
            store: mockClients[0].stores[0]
        };
        
        spyOn(localStorage, 'getItem')
            .withArgs('user').and.returnValue(null)
            .withArgs('selectedClient').and.returnValue(JSON.stringify(storedClient));
        
        clientsManagerMock.getClients.and.returnValue(of(mockClients));
        productsManagerMock.getProductsInventory.and.returnValue(of([]));
        
        await component.ngOnInit();
        
        expect(component.selectedClientId).toBe('1');
        expect(component.selectedClientName).toBe('Juan Pérez');
        expect(component.stores.length).toBe(1);
    });

    // Pruebas para filtrar productos
    it('should filter products by category only', () => {
        component.products = [...mockProducts];
        component.selectedCategory = 'Ropa';
        component.filtrarProducts();
        
        expect(component.filteredProducts.length).toBe(1);
        expect(component.filteredProducts[0].category).toBe('Ropa');
    });

    it('should filter products by search term only', () => {
        component.products = [...mockProducts];
        component.searchTerm = 'cami';
        component.filtrarProducts();
        
        expect(component.filteredProducts.length).toBe(1);
        expect(component.filteredProducts[0].name).toBe('Camiseta');
    });

    it('should filter products by barcode', () => {
        component.products = [...mockProducts];
        component.searchTerm = '456';
        component.filtrarProducts();
        
        expect(component.filteredProducts.length).toBe(1);
        expect(component.filteredProducts[0].name).toBe('Zapato');
    });

    it('should filter products by both category and search term', () => {
        component.products = [...mockProducts, 
            { name: 'Camisa', barcode: '789', stock: 8, price: 120, category: 'Ropa' }];
        component.selectedCategory = 'Ropa';
        component.searchTerm = 'cami';
        component.filtrarProducts();
        
        expect(component.filteredProducts.length).toBe(2);
        expect(component.filteredProducts.every(p => p.category === 'Ropa' && p.name.toLowerCase().includes('cami'))).toBeTrue();
    });

    it('should return all products when no filters are applied', () => {
        component.products = [...mockProducts];
        component.searchTerm = '';
        component.selectedCategory = null;
        component.filtrarProducts();
        
        expect(component.filteredProducts.length).toBe(2);
    });

    // Pruebas para el carrito de compras
    it('should increment quantity when adding existing product to cart', () => {
        const product = mockProducts[0];
        const initialCart = [{ ...product, quantity: 1 }];
        localStorage.setItem('cartItems', JSON.stringify(initialCart));
        
        component.addToCart(product);
        
        const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        expect(savedCart.length).toBe(1);
        expect(savedCart[0].quantity).toBe(2);
    });

    it('should handle empty cart when adding first product', () => {
        const product = mockProducts[0];
        component.addToCart(product);
        
        const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        expect(savedCart.length).toBe(1);
        expect(savedCart[0].quantity).toBe(1);
    });

    // Pruebas para manejo de errores
    it('should handle error when loading client by ID', () => {
        clientsManagerMock.getClientByIdAsync.and.returnValue(throwError(() => ({
            error: { mssg: 'Error al cargar cliente' }
        })));
        
        component.loadClient('1');
        expect(component.error).toBe('Error al cargar cliente');
    });

    it('should handle empty stores array when selecting client', () => {
        const clientWithNoStores = {
            ...mockClients[0],
            stores: []
        };
        component.clients = [clientWithNoStores];
        component.selectedClientId = '1';
        
        component.onSelectClient();
        
        expect(component.stores.length).toBe(0);
        expect(component.selectedStoreName).toBeNull();
    });

    it('should not throw error when selecting store with no stores available', () => {
        component.stores = [];
        component.selectedStoreName = 'Tienda Inexistente';
        
        expect(() => component.onSelectStore()).not.toThrow();
    });

    // Pruebas para clearFilters
    it('should clear all filters correctly', () => {
        component.searchTerm = 'test';
        component.selectedCategory = 'Ropa';
        component.filteredProducts = [mockProducts[0]];
        
        component.clearFilters();
        
        expect(component.searchTerm).toBe('');
        expect(component.selectedCategory).toBeNull();
        expect(component.filteredProducts.length).toBe(component.products.length);
    });

    // Pruebas para selección de categoría
    it('should select category correctly', () => {
        const category = 'Ropa';
        component.onSelecCategory(category);
        expect(component.selectedCategory).toBe(category);
    });
});