
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { ChangeStateModel, ChangeStateModelResponse, SellerVisits } from '../models/visits.model';
import { VisitAnalysisResult } from '../models/details-video.model';

@Injectable({
    providedIn: 'root',
})
export class VisitsManager {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
    };

    constructor() { }

    getVisitsBySeller(sellerId: string): Observable<SellerVisits> {
        return this.http.get<SellerVisits>(this.apiUrl + '/orders/visits/' + sellerId, { headers: this.headers })
    }

    changeStateVisit(visitId: string, model: ChangeStateModel): Observable<ChangeStateModelResponse> {
        return this.http.put<ChangeStateModelResponse>(this.apiUrl + '/orders/visit/' + visitId, model, { headers: this.headers })
    }

    uploadVisitVideo(visitId: string, videoFile: File): Observable<any> {
        const formData = new FormData();
        const emptyFile = new File([""], "empty.mp4");
        formData.append('video', emptyFile);
        return this.http.post(`${this.apiUrl}/ai/${visitId}`, formData, { headers: this.headers });
    }

    getVisitAnalysis(visitId: string): Observable<VisitAnalysisResult> {
        return this.http.get<VisitAnalysisResult>(
            `${this.apiUrl}/ai/result/${visitId}`,
            { headers: this.headers }
        );
    }
}
