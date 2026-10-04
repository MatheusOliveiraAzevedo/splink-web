import { Component } from '@angular/core';
import { GeneralUtils } from '../../shared/generalutils';
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
    this.generalUtils.abrirWhatsApp({ position: 'floating' });
  }

}
