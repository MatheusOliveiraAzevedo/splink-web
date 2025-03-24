import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-privacy-cookies',
  imports: [],
  templateUrl: './privacy-cookies.component.html',
  styleUrl: './privacy-cookies.component.scss'
})
export class PrivacyCookiesComponent {

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'

}
