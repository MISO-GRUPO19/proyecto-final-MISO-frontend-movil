import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IFormGroup, RxFormBuilder, RxReactiveFormsModule, email } from '@rxweb/reactive-form-validators';
import { AuthManager } from '../../../layout/auth/services/auth.service';
import { ProfileForm } from '../models/profile-form.model';
import { of, Subscription, switchMap } from 'rxjs';

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
  public subscriptions: Subscription[] = [];
  email: string | null = null;

  constructor(
    private formBuilder: RxFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authManager: AuthManager,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    const routerParamsSubscribe = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        of(params)
      )
    ).subscribe((data: any) => {
      const params = data.params;
      if (params.email) {
        this.email = params.email;
      }
    });
    this.subscriptions.push(routerParamsSubscribe);

    this.formGroup = this.formBuilder.formGroup(new ProfileForm()) as IFormGroup<ProfileForm>;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;
    this.authManager.createCustomers({
      firstName: this.formGroup.controls.name.value,
      lastName: this.formGroup.controls.lastName.value,
      country: this.formGroup.controls.country.value,
      address: this.formGroup.controls.address.value,
      phoneNumber: this.formGroup.controls.telphone.value,
      email: this.email ? this.email : ""
    }).subscribe({
      next: (response) => {
        this.router.navigate(['/register-success']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.mssg || 'Error de autenticación';
      }
    });
  }

}