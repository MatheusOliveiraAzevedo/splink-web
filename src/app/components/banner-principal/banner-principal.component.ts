import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-banner-principal',
  standalone: true,
  imports: [],
  templateUrl: './banner-principal.component.html',
  styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent {

  @HostBinding('class') class = 'bg-white-to-primary'

}
