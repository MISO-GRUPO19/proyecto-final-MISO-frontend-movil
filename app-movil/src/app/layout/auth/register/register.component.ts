import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IFormGroup, RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { rolesEnum } from '../../roles.enum';
import { LoginRequest } from '../models/login-form.model';
import { AuthManager } from '../services/auth.service';
import { RegisterForm } from '../models/register-form.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, RxReactiveFormsModule, ReactiveFormsModule, TranslateModule, RouterModule],
})
export class RegisterComponent implements OnInit {
  formGroup!: IFormGroup<RegisterForm>;
  error: string | null = null;
  hide = true;
  hideConfirm = true;

  constructor(
    private formBuilder: RxFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authManager: AuthManager,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.formGroup(new RegisterForm()) as IFormGroup<RegisterForm>;
  }

  onSubmit(): void {
    debugger;
    // if (this.formGroup.invalid) return;

    this.router.navigate(['/profile']);

    // this.authManager.login(this.formGroup.value).subscribe({
    //   next: (response) => {
    //     if (response.user.role === rolesEnum.Administrador) {
    //       this.error = 'Los usuarios con el rol de Administrador no pueden ingresar.';
    //     }
    //     else {
    //       sessionStorage.setItem('access_token', response.access_token);
    //       sessionStorage.setItem('refresh_token', response.refresh_token);
    //       sessionStorage.setItem('user', JSON.stringify(response.user));

    //       this.router.navigate(['/home']);
    //     }
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.error = err.error?.message || 'Error de autenticación';
    //   }
    // });
  }

}