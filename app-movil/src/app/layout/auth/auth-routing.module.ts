import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { LoginInComponent } from './login-in/login-in.component';
import { BaseAuthComponent } from './base-auth/base-auth.component';

const routes: Routes = [
  {
    path: '',
    component: BaseAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      }, 
      {
        path: 'register',
        component: RegisterComponent,
      }, 
      {
        path: 'create-profile',
        component: CreateProfileComponent,
      }, 
      {
        path: 'login-in',
        component: LoginInComponent,
      }, 
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },   

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
