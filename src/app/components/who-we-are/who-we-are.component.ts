import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [],
  templateUrl: './who-we-are.component.html',
  styleUrl: './who-we-are.component.scss'
})
export class WhoWeAreComponent {

  constructor(
    private router: Router
  ) {}

  @HostBinding('class') class = 'd-flex flex-column align-items-center'

  backPage() {
    this.router.navigate(['/home'])
  }

}
