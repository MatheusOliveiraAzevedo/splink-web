import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-with-us',
  standalone: true,
  imports: [],
  templateUrl: './work-with-us.component.html',
  styleUrl: './work-with-us.component.scss'
})
export class WorkWithUsComponent {


  constructor(
    private router: Router
  ) {}

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'
  textObservation: string = ''

  backPage() {
    this.router.navigate(['/home'])
  }

}
