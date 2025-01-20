import { Component, HostBinding } from '@angular/core';
import { ButtomFooterComponent } from "../buttom-footer/buttom-footer.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtomFooterComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @HostBinding('class') class = 'd-flex bg-color-primary-dark'

}
