import { Component, HostBinding } from '@angular/core';
import { links } from '../../shared/model/links';

@Component({
  selector: 'app-banner-principal',
  standalone: true,
  imports: [],
  templateUrl: './banner-principal.component.html',
  styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent {

  @HostBinding('class') class = 'bg-white-to-primary'

  goToWhatsApp() {
    window.open(links.whatsapp, '_blank')
  }
  

}
