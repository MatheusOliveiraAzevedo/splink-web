import { Component } from '@angular/core';
import { BannerPrincipalComponent } from "../../components/banner-principal/banner-principal.component";
import { RetainAttentionComponent } from "../../components/retain-attention/retain-attention.component";
import { CarouselPlansComponent } from "../../components/carousel-plans/carousel-plans.component";
import { CoverageAreaComponent } from "../../components/coverage-area/coverage-area.component";
import { WhoWeAreComponent } from "../../components/who-we-are/who-we-are.component";
import { WorkWithUsComponent } from "../../components/work-with-us/work-with-us.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerPrincipalComponent, RetainAttentionComponent, CarouselPlansComponent, CoverageAreaComponent, WhoWeAreComponent, WorkWithUsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
