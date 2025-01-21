import { Component, HostBinding } from '@angular/core';
import { links } from '../../shared/model/links';

@Component({
  selector: 'app-carousel-plans',
  standalone: true,
  imports: [],
  templateUrl: './carousel-plans.component.html',
  styleUrl: './carousel-plans.component.scss'
})
export class CarouselPlansComponent {

  @HostBinding('class') class = 'd-flex py-6'

  goToWhatsApp() {
    window.open(links.whatsapp, '_blank')
  }

}
