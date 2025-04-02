import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IonicModule, IonIcon } from '@ionic/angular';
import { LoginRequest } from '../models/login-form.model';
import { IFormGroup, RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { mail, lockClosed } from 'ionicons/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthManager } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RxReactiveFormsModule, ReactiveFormsModule, TranslateModule],
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
      next: (response) => {
        sessionStorage.setItem('access_token', response.access_token);
        sessionStorage.setItem('refresh_token', response.refresh_token);
        sessionStorage.setItem('user', JSON.stringify(response.user));

        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Error de autenticación';
      }
    });
  }

}