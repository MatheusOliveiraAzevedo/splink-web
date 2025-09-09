import { Component, input } from '@angular/core';
import { links } from '../../shared/model/links';
import { GeneralUtils } from '../../shared/generalutils';

@Component({
  selector: 'app-button-attention',
  imports: [],
  templateUrl: './button-attention.component.html',
  styleUrl: './button-attention.component.scss'
})
export class ButtonAttentionComponent {

  label = input.required<string>()
  linkButton = links.whatsapp
  generalUtils = new GeneralUtils

  returnLinkButton() {
    this.generalUtils.registrarConversao('whatsapp');
    return window.open(links.whatsapp, '_blank')
  }

}
