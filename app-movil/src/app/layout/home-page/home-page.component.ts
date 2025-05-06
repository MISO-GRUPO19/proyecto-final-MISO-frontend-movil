import { Component, OnInit } from '@angular/core';
import { rolesEnum } from '../roles.enum';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule]
})
export class HomePageComponent implements OnInit {
  public roleId?: number = rolesEnum.Vendedor;
  public roles = rolesEnum;
  pageTitle = '';
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.updatePageTitle();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.roleId = user.role;
    }
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
  private updatePageTitle(): void {
    const childRoute = this.getDeepestRoute(this.route);

    if (childRoute.snapshot.data && childRoute.snapshot.data['title']) {
      this.pageTitle = childRoute.snapshot.data['title'];
    } else {
      this.pageTitle = 'Inicio';
    }
  }
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}
