import { Routes } from '@angular/router';
import { DeliveriesListComponent } from './deliveries-list/deliveries-list.component';
import { DeliveriesFormComponent } from './deliveries-form/deliveries-form.component';

export const deliveriesRoutes: Routes = [
    {
        path: '',
        component: DeliveriesListComponent,
    },
    {
        path: 'details/:id',
        component: DeliveriesFormComponent,
    },
];
