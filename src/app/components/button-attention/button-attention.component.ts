import { Component, input } from '@angular/core';
import { links } from '../../shared/model/links';

@Component({
  selector: 'app-button-attention',
  imports: [],
  templateUrl: './button-attention.component.html',
  styleUrl: './button-attention.component.scss'
})
export class ButtonAttentionComponent {

  label = input.required<string>()
  linkButton = links.whatsapp

  returnLinkButton() {
    return window.open(links.whatsapp, '_blank')
  }

}
