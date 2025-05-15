import { Component, Input, OnInit } from '@angular/core';
import { VisitsManager } from '../services/visits.service';
import { CommonModule } from '@angular/common';
import { VisitAnalysisResult } from '../models/details-video.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-video',
  templateUrl: './details-video.component.html',
  styleUrls: ['./details-video.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class DetailsVideoComponent implements OnInit {
  videoId: string = '';
  analysisPoints: string[] = [];
  recommendations: string[] = [];
  status: string = '';
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private visitsManager: VisitsManager
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.videoId = id;
        this.fetchAnalysis(id);
      } else {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  fetchAnalysis(videoId: string): void {
    this.visitsManager.getVisitAnalysis(videoId).subscribe({
      next: (res: VisitAnalysisResult) => {
        this.analysisPoints = res.result.analisis;
        this.recommendations = res.result.recomendaciones;
        this.status = res.status;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener el análisis:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}