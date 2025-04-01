import { Component, OnInit } from '@angular/core';
import { rolesEnum } from '../roles.enum';
import { IonicModule, IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports:[IonicModule, CommonModule]
})
export class HomePageComponent  implements OnInit {
  public roleId: number = rolesEnum.client
  public roles = rolesEnum;

  constructor() {  addIcons({ library, playCircle, radio, search });}

  ngOnInit() {}

}
