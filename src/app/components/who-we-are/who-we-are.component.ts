import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonAttentionComponent } from "../button-attention/button-attention.component";
import { links } from '../../shared/model/links';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [ButtonAttentionComponent],
  templateUrl: './who-we-are.component.html',
  styleUrl: './who-we-are.component.scss'
})
export class WhoWeAreComponent {

  constructor(
    private router: Router
  ) {}

  @HostBinding('class') class = 'd-flex flex-column align-items-center'
  linkButton = links.whatsapp

  backPage() {
    this.router.navigate(['/home'])
  }

}
