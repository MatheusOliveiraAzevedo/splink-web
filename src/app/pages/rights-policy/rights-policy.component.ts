import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-rights-policy',
  imports: [],
  templateUrl: './rights-policy.component.html',
  styleUrl: './rights-policy.component.scss'
})
export class RightsPolicyComponent {

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'

}
