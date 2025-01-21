import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.scss'
})
export class Error404Component {

  constructor(
    private router: Router
  ) {}
  
  @HostBinding('class') class = 'd-flex justify-content-center align-items-center'

  backPage() {
    this.router.navigate(['/home'])
  }

}
