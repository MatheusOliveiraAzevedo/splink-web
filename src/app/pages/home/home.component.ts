import { Component } from '@angular/core';
import { BannerPrincipalComponent } from "../../components/banner-principal/banner-principal.component";
import { RetainAttentionComponent } from "../../components/retain-attention/retain-attention.component";
import { CarouselPlansComponent } from "../../components/carousel-plans/carousel-plans.component";
import { CoverageAreaComponent } from "../../components/coverage-area/coverage-area.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerPrincipalComponent, RetainAttentionComponent, CarouselPlansComponent, CoverageAreaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
