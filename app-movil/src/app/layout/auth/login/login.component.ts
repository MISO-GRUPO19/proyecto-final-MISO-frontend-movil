import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { IonicModule, IonIcon } from '@ionic/angular';
import { LoginRequest, LoginResponse } from '../models/login-form.model';
import { IFormGroup, RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { mail, lockClosed } from 'ionicons/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthManager } from '../services/auth.service';
import { rolesEnum } from '../../roles.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RxReactiveFormsModule, ReactiveFormsModule, TranslateModule, RouterModule],
})
export class LoginComponent implements OnInit {
  formGroup!: IFormGroup<LoginRequest>;
  error: string | null = null;
  hide = true;

  constructor(
    private formBuilder: RxFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authManager: AuthManager,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.formGroup(new LoginRequest()) as IFormGroup<LoginRequest>;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;


    this.authManager.login(this.formGroup.value).subscribe({
      next: (response: LoginResponse) => {
        switch (response.user.role) {
          case rolesEnum.Administrador:
            this.error = 'Los usuarios con el rol de Administrador no pueden ingresar.';
            break;
          case rolesEnum.Cliente:
            this.sessionStorage(response);
            if (!response.isCustomer) {
              const query = {
                email: this.formGroup.controls.email.value,
              };
              this.router.navigate(['/profile'], { queryParams: query });
            }
            else {
              this.router.navigate(['/home/deliveries']);
            }
            break;
          case rolesEnum.Vendedor:
            this.sessionStorage(response);
            this.router.navigate(['/home/clients']);
            break;
          default:
            break;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.mssg || 'Error de autenticación';
      }
    });
  }

  sessionStorage(response: LoginResponse) {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

}