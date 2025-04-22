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
    if (this.formGroup.invalid) return;


    this.authManager.registerCustomers({
      email: this.formGroup.controls.email.value,
      password: this.formGroup.controls.password.value,
      confirm_password: this.formGroup.controls.confirmPassword.value,
      role: rolesEnum.Cliente
    }).subscribe({
      next: (response) => {
        const query = {
          email: this.formGroup.controls.email.value,
        };
        this.router.navigate(['/profile'], { queryParams: query });
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.mssg || 'Error de autenticación';
      }
    });
  }

}