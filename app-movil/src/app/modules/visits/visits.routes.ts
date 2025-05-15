import { Routes } from '@angular/router';
import { VisitsListComponent } from './visits-list/visits-list.component';
import { VideoComponent } from './video/video.component';
import { DetailsVideoComponent } from './details-video/details-video.component';
export const visitsRoutes: Routes = [
    {
        path: '',
        component: VisitsListComponent,
    },
    {
        path: 'video/:id',
        component: VideoComponent,
    },
    {
        path: 'details/:id',
        component: DetailsVideoComponent,
    },
];
