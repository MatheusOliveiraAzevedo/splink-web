import { Component, input } from '@angular/core';
import { GeneralUtils, WhatsAppPosition } from '../../shared/generalutils';

@Component({
  selector: 'app-button-attention',
  imports: [],
  templateUrl: './button-attention.component.html',
  styleUrl: './button-attention.component.scss'
})
export class ButtonAttentionComponent {

  label = input.required<string>()
  position = input.required<WhatsAppPosition>()
  generalUtils = new GeneralUtils

  returnLinkButton() {
    this.generalUtils.abrirWhatsApp({ position: this.position() });
  }

}
