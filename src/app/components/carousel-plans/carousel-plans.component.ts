import { Component, CUSTOM_ELEMENTS_SCHEMA, HostBinding } from '@angular/core';
import { links } from '../../shared/model/links';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { configurationCarrousel, plans } from '../../shared/model/plans';

@Component({
  selector: 'app-carousel-plans',
  standalone: true,
  imports: [Carousel, ButtonModule],
  templateUrl: './carousel-plans.component.html',
  styleUrl: './carousel-plans.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarouselPlansComponent {

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6'
  plans: any[] = plans;
  responsiveOptions: any[] = configurationCarrousel;

  goToWhatsApp() {
    window.open(links.whatsapp, '_blank')
  }
}
