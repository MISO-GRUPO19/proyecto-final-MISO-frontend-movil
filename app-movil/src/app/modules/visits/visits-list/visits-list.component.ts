import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { VisitsManager } from '../services/visits.service';
import { ChangeStateModelResponse, SellerVisits, STATUS_VISITS, VisitList, VisitStatus } from '../models/visits.model';
import { VisitAnalysisResult } from '../models/details-video.model';

@Component({
  selector: 'app-visits-list',
  templateUrl: './visits-list.component.html',
  styleUrls: ['./visits-list.component.css'],
  standalone: true,
  imports: [CommonModule, RxReactiveFormsModule, ReactiveFormsModule, TranslateModule, RouterModule],
})
export class VisitsListComponent implements OnInit {
  VisitStatus = VisitStatus;
  STATUS_VISITS = STATUS_VISITS;
  visits: VisitList[] = [];
  error: string | null = null;
  sellerId: string = '';
  constructor(private router: Router, private route: ActivatedRoute, private visitsManager: VisitsManager,) {

  }
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.sellerId = user.id;
      this.fetchVisits();
    }

  }

  fetchVisits() {
    if (this.sellerId) {
      this.visitsManager.getVisitsBySeller(this.sellerId).subscribe({
        next: (response: SellerVisits) => {
          this.visits = response.visits_info;
        },
        error: (err) => {
          console.error(err);
          this.error = err.error?.mssg || 'Error de autenticación';
        }
      });

    }

  }



  getTagClass(tag: string): string {
    switch (tag) {
      case 'Próximo':
        return 'bg-orange-100 text-orange-800';
      case VisitStatus.NO_VISITADO:
        return 'bg-yellow-100 text-yellow-800';
      case VisitStatus.VISITADO:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }

  onVisitStatusClick(visit: VisitList, state: string): void {
    if (visit) {
      this.visitsManager.changeStateVisit(visit.visit_id, { state: state }).subscribe({
        next: (response: ChangeStateModelResponse) => {
          alert("Se realizo exitosamente la visitia");
          this.fetchVisits();
        },
        error: (err) => {
          console.error(err);
          this.error = err.error?.mssg || 'Error de autenticación';
        }
      });

    }
  }
  openCamara(id: string): void {
    this.visitsManager.getVisitAnalysis(id).subscribe({
      next: (res: VisitAnalysisResult) => {
        this.router.navigate(['/home/visits/video/details/' + id],);
      },
      error: (err) => {
        this.router.navigate(['/home/visits/video/' + id],);
      }
    });
  }
}


