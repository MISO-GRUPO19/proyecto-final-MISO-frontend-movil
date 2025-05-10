import { Routes } from '@angular/router';
import { VisitsListComponent } from './visits-list/visits-list.component';
import { VideoComponent } from './video/video.component';
export const visitsRoutes: Routes = [
    {
        path: '',
        component: VisitsListComponent,
    },
    {
        path: 'video',
        component: VideoComponent,
    },
    //  {
    //     path: 'video/:id',
    //     component: DetailsComponent,
    // },
];
