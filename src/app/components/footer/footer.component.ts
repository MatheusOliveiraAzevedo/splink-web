import { Component, HostBinding, OnInit } from '@angular/core';
import { ButtomFooterComponent } from "../buttom-footer/buttom-footer.component";
import { links } from '../../shared/model/links';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtomFooterComponent, NgbTooltipModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  @HostBinding('class') class = 'd-flex bg-color-primary-dark'
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
}
