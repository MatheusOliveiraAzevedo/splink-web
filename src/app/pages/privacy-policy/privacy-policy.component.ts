import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  constructor(
    private router: Router
  ) { }

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'

  backPage() {
    this.router.navigate(['/home'])
  }


}
