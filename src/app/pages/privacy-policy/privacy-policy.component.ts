import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'

}
