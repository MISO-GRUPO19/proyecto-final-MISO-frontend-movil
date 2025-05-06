import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-visits-list',
  templateUrl: './visits-list.component.html',
  styleUrls: ['./visits-list.component.css'],
  standalone: true,
  imports: [CommonModule, RxReactiveFormsModule, ReactiveFormsModule, TranslateModule, RouterModule],
})
export class VisitsListComponent {

  constructor(private router: Router, private route: ActivatedRoute) { }
  visits = [
    {
      id: 1,
      clientName: 'Surtiviveres',
      storeName: 'Tienda Río Bravo',
      visitDate: '4/5/2026 10:00 a. m.',
      phoneNumber: '3182192112',
      address: 'Av. Cristóbal Colón E5-35, Quito 170522',
      visitStatus: 'visited',
      timingTag: 'Próximo',
    },
    {
      id: 2,
      clientName: 'Estación Surtidora',
      storeName: 'Tienda Rionegro',
      visitDate: '4/5/2026 5:00 p. m.',
      phoneNumber: '31212212312',
      address: 'Avenida NNNU Oe4-27 y, Av. de la República 170508',
      visitStatus: 'visited',
      timingTag: 'Más tarde',
    },
    {
      id: 3,
      clientName: 'Mercado Carapungo',
      storeName: 'Tienda Río Quijos',
      visitDate: '3/5/2026 6:00 p. m.',
      phoneNumber: '3212812881',
      address: 'Río Quijos N15-24 y, Quito 170204',
      visitStatus: 'notVisited',
      timingTag: 'Visitado',
    },
  ];

  getTagClass(tag: string): string {
    switch (tag) {
      case 'Próximo':
        return 'bg-orange-100 text-orange-800';
      case 'Más tarde':
        return 'bg-yellow-100 text-yellow-800';
      case 'Visitado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }


  openCamara(id: number): void {
    this.router.navigate(['/home/visits/video/' + id],);
  }
}