import { Routes } from '@angular/router';
import { HomePageComponent } from './layout/home-page/home-page.component';
import { BaseAuthComponent } from './layout/auth/base-auth/base-auth.component';
import { ProfileFormComponent } from './modules/profile/profile-form/profile-form.component';
import { LoginInComponent } from './layout/auth/login-in/login-in.component';

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
        path: 'profile',
        component: ProfileFormComponent,
    },
    {
        path: 'register-success',
        component: LoginInComponent,
    },
    {
        path: 'auth',
        component: BaseAuthComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./layout/auth/login/login.component').then(m => m.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () => import('./layout/auth/register/register.component').then(m => m.RegisterComponent),
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
        ]
    },
    {
        path: '', redirectTo: 'auth', pathMatch: 'full'
    },
];
