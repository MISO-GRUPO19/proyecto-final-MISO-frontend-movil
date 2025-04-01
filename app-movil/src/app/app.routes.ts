import { Routes } from '@angular/router';
import { HomePageComponent } from './layout/home-page/home-page.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomePageComponent,
        children: [
            {
                path: 'customers',
                loadChildren: () => import('./modules/customers/customers.module').then((m) => m.CustomersModule),
            },
            {
                path: 'deliveries',
                loadChildren: () => import('./modules/deliveries/deliveries.module').then((m) => m.DeliveriesModule),
            },
            {
                path: 'inventory',
                loadChildren: () => import('./modules/inventory/inventory.module').then((m) => m.InventoryModule),
            },
            {
                path: 'products',
                loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
            },
            {
                path: 'profile',
                loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
            },
            {
                path: 'reports',
                loadChildren: () => import('./modules/reports/reports.module').then((m) => m.ReportsModule),
            },
            {
                path: 'shopping-cart',
                loadChildren: () => import('./modules/shopping-cart/shopping-cart.module').then((m) => m.ShoppingCartModule),
            },
            {
                path: 'visits',
                loadChildren: () => import('./modules/visits/visits.module').then((m) => m.VisitsModule),
            },
            {
                path: '', redirectTo: 'products', pathMatch: 'full',
            },
        ],
    },
    {
        path: 'auth',
        children: [
            {
                path: '',
                loadChildren: () => import('./layout/auth/auth.module').then(m => m.AuthModule),
            },
            { path: '', redirectTo: '', pathMatch: 'full' },
        ]
    },
    {
        path: '', redirectTo: 'auth', pathMatch: 'full'
    },
];
