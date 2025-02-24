import { Component, HostBinding, OnInit } from '@angular/core';
import { ButtomFooterComponent } from "../buttom-footer/buttom-footer.component";
import { links } from '../../shared/model/links';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtomFooterComponent, NgbTooltipModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  @HostBinding('class') class = 'd-flex justify-content-center bg-color-primary-dark'
  links: any

  ngOnInit(): void {
    this.links = links
  }

  goToWhatsApp() {
    window.open(links.whatsapp, '_blank')
  }

  goToInstagram() {
    window.open(links.instagram, '_blank')
  }

  goToFacebook() {
    window.open(links.facebook, '_blank')
  }

  goToMapAddress(map) {
    window.open(links[map], '_blank')
  }

  goToAppAndroid() {
    window.open(links.app_android, '_blank')
  }

  goToAppiPhone() {
    window.open(links.app_iphone, '_blank')
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
