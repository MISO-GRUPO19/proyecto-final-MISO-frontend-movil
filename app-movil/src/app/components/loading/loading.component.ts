import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  standalone: true,
})
export class LoadingComponent implements OnInit {
  title = 'Registro exitoso';
  message = 'Tu cuenta fue creada con éxito.';
  redirectTo = '/auth/login';
  clearSession = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.title = params['title'] || this.title;
      this.message = params['message'] || this.message;
      this.redirectTo = params['redirectTo'] || this.redirectTo;
    });

    setTimeout(() => {
      this.goToNext();
    }, 3000);
  }

  goToNext() {
    this.router.navigate([this.redirectTo]);
  }
}
