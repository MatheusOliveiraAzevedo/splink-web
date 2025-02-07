import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-buttom-footer',
  standalone: true,
  imports: [],
  templateUrl: './buttom-footer.component.html',
  styleUrl: './buttom-footer.component.scss'
})
export class ButtomFooterComponent {

  @HostBinding('class') class = 'flex-grow-1'
  label = input.required<string>()
  url = input<string>()

}
