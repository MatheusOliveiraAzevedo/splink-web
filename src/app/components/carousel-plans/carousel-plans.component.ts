import { Component, CUSTOM_ELEMENTS_SCHEMA, HostBinding, OnInit } from '@angular/core';
import { links } from '../../shared/model/links';
import Swiper from 'swiper';
import { register } from 'swiper/element';

@Component({
  selector: 'app-carousel-plans',
  standalone: true,
  imports: [],
  templateUrl: './carousel-plans.component.html',
  styleUrl: './carousel-plans.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarouselPlansComponent implements OnInit {

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6'

  ngOnInit(): void {
    register();
  }

  goToWhatsApp() {
    window.open(links.whatsapp, '_blank')
  }


}
