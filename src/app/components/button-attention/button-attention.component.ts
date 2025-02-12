import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button-attention',
  imports: [],
  templateUrl: './button-attention.component.html',
  styleUrl: './button-attention.component.scss'
})
export class ButtonAttentionComponent {

  label = input.required<string>()

}
