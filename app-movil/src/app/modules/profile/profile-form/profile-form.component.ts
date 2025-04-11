import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IFormGroup, RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { AuthManager } from '../../../layout/auth/services/auth.service';
import { ProfileForm } from '../models/profile-form.model';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css'],
  standalone: true,
  imports: [CommonModule, RxReactiveFormsModule, ReactiveFormsModule, TranslateModule, RouterModule],
})
export class ProfileFormComponent implements OnInit {
  formGroup!: IFormGroup<ProfileForm>;
  error: string | null = null;
  hide = true;
  hideConfirm = true;
  countries: string[] = ['Colombia', 'México', 'Argentina', 'España'];
  constructor(
    private formBuilder: RxFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authManager: AuthManager,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.formGroup(new ProfileForm()) as IFormGroup<ProfileForm>;
  }

  onSubmit(): void {
    // if (this.formGroup.invalid) return;
    this.router.navigate(['/home']);
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