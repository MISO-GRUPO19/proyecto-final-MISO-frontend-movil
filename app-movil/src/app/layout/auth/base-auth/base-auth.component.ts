import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-base-auth',
  templateUrl: './base-auth.component.html',
  styleUrls: ['./base-auth.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class BaseAuthComponent implements OnInit {
  get useLogoHorizontal(): boolean {
    return this.router.url.startsWith('/auth/register');
  }

  constructor(private router: Router) { }


  ngOnInit() { }

}
