import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InventoryListComponent } from './inventory-list.component';
import { ProductsManager } from '../services/products.service';
import { ProductsList } from '../models/inventory.model';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ALLOWED_CATEGORIES, CATEGORY_IMAGES } from '../models/categories.model';

describe('InventoryListComponent', () => {
  let component: InventoryListComponent;
  let fixture: ComponentFixture<InventoryListComponent>;
  let mockProductsManager: jasmine.SpyObj<ProductsManager>;

  const mockProducts: ProductsList[] = [
    {
      name: 'Leche Entera',
      barcode: '123456789',
      stock: 15,
      price: 3000,
      category: 'Lácteos'
    },
    {
      name: 'Manzana Roja',
      barcode: '987654321',
      stock: 25,
      price: 1800,
      category: 'Frutas'
    },
    {
      name: 'Carne Molida',
      barcode: '456789123',
      stock: 10,
      price: 12000,
      category: 'Carnes'
    }
  ];

  beforeEach(waitForAsync(() => {
    const productSpy = jasmine.createSpyObj('ProductsManager', ['getProductsInventory']);

    TestBed.configureTestingModule({
      imports: [InventoryListComponent, CommonModule, FormsModule],
      providers: [{ provide: ProductsManager, useValue: productSpy }]
    }).compileComponents();

    mockProductsManager = TestBed.inject(ProductsManager) as jasmine.SpyObj<ProductsManager>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryListComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar categorías al iniciar', () => {
    mockProductsManager.getProductsInventory.and.returnValue(of([])); // evita error
    component.ngOnInit();
    expect(component.categorias.length).toBe(ALLOWED_CATEGORIES.length);
    expect(component.categorias[0]).toEqual(jasmine.objectContaining({
      name: ALLOWED_CATEGORIES[0],
      img: CATEGORY_IMAGES[ALLOWED_CATEGORIES[0]]
    }));
  });

  it('debería cargar productos correctamente', () => {
    mockProductsManager.getProductsInventory.and.returnValue(of(mockProducts));
    component.ngOnInit();
    expect(mockProductsManager.getProductsInventory).toHaveBeenCalled();
    expect(component.products.length).toBe(3);
    expect(component.filteredProducts.length).toBe(3);
  });

  it('debería manejar error al obtener productos', () => {
    const consoleSpy = spyOn(console, 'error');
    mockProductsManager.getProductsInventory.and.returnValue(throwError(() => ({
      error: { mssg: 'Error de autenticación' }
    })));

    component.ngOnInit();
    expect(consoleSpy).toHaveBeenCalled();
    expect(component.error).toBe('Error de autenticación');
  });

  it('debería filtrar productos por texto', () => {
    component.products = mockProducts;
    component.searchTerm = 'manzana';
    component.filtrarProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toContain('Manzana');
  });

  it('debería filtrar productos por categoría', () => {
    component.products = mockProducts;
    component.selectedCategory = 'Carnes';
    component.filtrarProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].category).toBe('Carnes');
  });

  it('debería filtrar por texto y categoría simultáneamente', () => {
    component.products = mockProducts;
    component.searchTerm = 'carne';
    component.selectedCategory = 'Carnes';
    component.filtrarProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Carne Molida');
  });

  it('debería limpiar filtros correctamente', () => {
    component.products = mockProducts;
    component.searchTerm = 'manzana';
    component.selectedCategory = 'Frutas';
    component.filtrarProducts();
    expect(component.filteredProducts.length).toBe(1);

    component.clearFilters();
    expect(component.searchTerm).toBe('');
    expect(component.selectedCategory).toBeNull();
    expect(component.filteredProducts.length).toBe(3);
  });
});
