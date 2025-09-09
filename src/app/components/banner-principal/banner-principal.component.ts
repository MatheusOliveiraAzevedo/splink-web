import { Component, HostBinding } from '@angular/core';
import { links } from '../../shared/model/links';
import { GeneralUtils } from '../../shared/generalutils';

@Component({
  selector: 'app-banner-principal',
  standalone: true,
  imports: [],
  templateUrl: './banner-principal.component.html',
  styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent {

  @HostBinding('class') class = 'bg-white-to-primary'
  generalUtils = new GeneralUtils

  goToWhatsApp() {
    this.generalUtils.registrarConversao('whatsapp');
    window.open(links.whatsapp, '_blank')
  }
  

}
