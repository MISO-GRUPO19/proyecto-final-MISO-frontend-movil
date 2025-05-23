import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from '../models/deliveries.model';
import { OrdersManager } from '../services/deliveries.service';
import { OrderState } from '../models/states.enum';

@Component({
  selector: 'app-deliveries-form',
  templateUrl: './deliveries-form.component.html',
  styleUrls: ['./deliveries-form.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DeliveriesFormComponent implements OnInit {
  deliveryId: string = '';
  delivery: OrderResponse | null = null;
  orderState = OrderState;

  constructor(private route: ActivatedRoute, private ordersManager: OrdersManager) { }

  ngOnInit(): void {
    this.deliveryId = this.route.snapshot.paramMap.get('id') || '';
    if (this.deliveryId) {
      this.fetchDeliveries();
    } else {
      console.error('Delivery ID is missing');
      this.delivery = null;
    }
  }

  fetchDeliveries() {
    if (this.deliveryId) {
      this.ordersManager.getOrdersById(this.deliveryId).subscribe({
        next: (response: OrderResponse[]) => {
          this.delivery = response.length > 0 ? response[0] : null;  // Si la respuesta está vacía, asignamos null
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
