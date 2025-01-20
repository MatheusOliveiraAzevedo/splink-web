import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [],
  templateUrl: './who-we-are.component.html',
  styleUrl: './who-we-are.component.scss'
})
export class WhoWeAreComponent {

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'

}
