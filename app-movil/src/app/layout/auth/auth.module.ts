import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginInComponent } from './login-in/login-in.component';
import { RegisterComponent } from './register/register.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
