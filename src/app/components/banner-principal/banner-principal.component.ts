import { Component } from '@angular/core';
import { GeneralUtils } from '../../shared/generalutils';

@Component({
  selector: 'app-banner-principal',
  standalone: true,
  imports: [],
  templateUrl: './banner-principal.component.html',
  styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent {

  generalUtils = new GeneralUtils

  goToWhatsApp() {
    this.generalUtils.abrirWhatsApp({ position: 'hero' });
  }
  
}
