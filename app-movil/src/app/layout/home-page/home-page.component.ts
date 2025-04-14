import { Component, OnInit } from '@angular/core';
import { rolesEnum } from '../roles.enum';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet]
})
export class HomePageComponent implements OnInit {
  public roleId?: number;
  public roles = rolesEnum;

  constructor() { }

  ngOnInit() {
    debugger;
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.roleId = user.role;
    }
  }

}
