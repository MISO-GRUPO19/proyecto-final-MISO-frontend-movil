import { ALLOWED_CATEGORIES, CATEGORY_IMAGES } from './../models/categories.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsList } from '../models/inventory.model';
import { ProductsManager } from '../services/products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InventoryListComponent implements OnInit {

  categorias: { name: string, img: string }[] = [];
  products: ProductsList[] = [];
  error: string | null = null;
  searchTerm = '';
  filteredProducts = [...this.products];
  constructor(private productsManager: ProductsManager,) { }
  ngOnInit(): void {
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
}