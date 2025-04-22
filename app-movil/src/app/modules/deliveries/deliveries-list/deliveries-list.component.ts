import { OrdersManager } from './../services/deliveries.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../models/deliveries.model';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { OrderState } from '../models/states.enum';

@Component({
  selector: 'app-deliveries-list',
  templateUrl: './deliveries-list.component.html',
  styleUrls: ['./deliveries-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DeliveriesListComponent implements OnInit {

  deliveries: OrderResponse[] = [];
  clientId: string | null = null;
  constructor(private ordersManager: OrdersManager, private router: Router,) { }
  orderState = OrderState;


  ngOnInit() {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.clientId = user.id;
    }
    this.fetchDeliveries();
  }
  fetchDeliveries() {
    if (this.clientId != null) {
      this.ordersManager.getOrdersByClient(this.clientId).subscribe({
        next: (response: OrderResponse[]) => {
          this.deliveries = response;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}

