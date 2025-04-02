import { Routes } from '@angular/router';
import { HomePageComponent } from './layout/home-page/home-page.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomePageComponent,
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            // { path: 'products', component: ProductsComponent },
            // { path: 'reports', component: ReportsComponent },
            // { path: 'deliveries', component: DeliveriesComponent },
            // { path: 'profile', component: ProfileComponent },
            // { path: 'inventory', component: InventoryComponent },
            // { path: 'visits', component: VisitsComponent },
            // { path: 'shopping-cart', component: ShoppingCartComponent },
            // { path: 'clients', component: ClientsComponent }
        ]
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./layout/auth/login/login.component').then(m => m.LoginComponent),
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
        ]
    },
    {
        path: '', redirectTo: 'auth', pathMatch: 'full'
    },
];
