import { Component } from '@angular/core';
import { GeneralUtils } from '../../shared/generalutils';
import { links } from '../../shared/model/links';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-button-wpp',
  imports: [NgbTooltipModule],
  templateUrl: './button-wpp.component.html',
  styleUrl: './button-wpp.component.scss'
})
export class ButtonWppComponent {

    generalUtils = new GeneralUtils

    goToWhatsApp() {
    this.generalUtils.registrarConversao('whatsapp');
    window.open(links.whatsapp, '_blank');
  }

}
