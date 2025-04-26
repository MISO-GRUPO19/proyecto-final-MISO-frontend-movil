import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientsList } from '../models/clients.model';
import { ClientsManager } from '../services/clients.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientsListComponent implements OnInit {

  clients: ClientsList[] = [];
  search = '';
  error: string | null = null;
  filteredClients = [...this.clients];


  constructor(private clientsManager: ClientsManager) { }

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.clientsManager.getClients().subscribe({
      next: (response: ClientsList[]) => {
        this.clients = response;
        this.filteredClients = [...this.clients];
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.mssg || 'Error de autenticación';
      }
    });
  }
  filtrarClientes(): void {
    const term = this.search.toLowerCase().trim();

    this.filteredClients = this.clients.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(term) ||
      client.country.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.address.toLowerCase().includes(term) ||
      client.phoneNumber.includes(term)
    );
  }
}
