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
  imports: [IonicModule, CommonModule, RxReactiveFormsModule, HttpClientModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  protected formBuilder = inject(RxFormBuilder);
  protected router: ActivatedRoute = inject(ActivatedRoute);
  protected route: Router = inject(Router);

  formGroup!: IFormGroup<LoginRequest>;
  error: string | null = null;
  hide = true;

  constructor() { }

  ngOnInit(): void {
    this.fetchDataFormView();
  }

  fetchDataFormView() {
    this.formGroup = this.formBuilder.formGroup(new LoginRequest()) as IFormGroup<LoginRequest>;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    // this.authManager.login(this.formGroup.value).subscribe({
    //   next: () => {
    //     this.route.navigate(['/menu']);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.error = err.error?.message || 'Error de autenticación';
    //   }
    // });
  }
}
