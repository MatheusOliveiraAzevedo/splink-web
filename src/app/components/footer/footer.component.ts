import { Component, HostBinding, OnInit } from '@angular/core';
import { ButtomFooterComponent } from "../buttom-footer/buttom-footer.component";
import { links } from '../../shared/model/links';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { GeneralUtils } from '../../shared/generalutils';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtomFooterComponent, NgbTooltipModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(
    private router: Router
  ) {}

  @HostBinding('class') class = 'd-flex justify-content-center bg-color-primary-dark'
  links = links
  generalUtils = new GeneralUtils

  goToWhatsApp(url) {
    this.generalUtils.registrarConversao('whatsapp');
    window.open(url, '_blank');
  }

  goTo(url) {
    window.open(url, '_blank');
  }

  goHome() {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        this.scrollTo('startBanner');
      }, 500);
    })
  }

  scrollTo(idElement) {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollTo(idElement);
        }, 500);
      })
    }
    const element = document.getElementById(idElement);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
