import { Component, HostBinding } from '@angular/core';
import { Route, Router } from '@angular/router';
import { links } from '../../shared/model/links';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent {

  constructor(
    private router: Router
  ) {}



  @HostBinding('class') class = 'd-block w-100'

  goHome() {
    this.router.navigate(['/home'])
  }

  goToCentral() {
      window.open(links.central, '_blank')
    }

}
