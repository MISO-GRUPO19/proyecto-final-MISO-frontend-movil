
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { SellerVisits } from '../models/visits.model';
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

    uploadVisitVideo(visitId: string, videoFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('video', videoFile, videoFile.name);
        formData.append('visitId', visitId);

        return this.http.post(`${this.apiUrl}/orders/visits/video`, formData, { headers: this.headers });
    }
    getVisitAnalysis(videoId: string): Observable<VisitAnalysisResult> {
        return this.http.get<VisitAnalysisResult>(
            `${this.apiUrl}/orders/visits/video/${videoId}/analysis`,
            { headers: this.headers }
        );
    }
}
