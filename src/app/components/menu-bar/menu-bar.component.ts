import { Component, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { links, navBarMenu } from '../../shared/model/links';
import { WorkWithUsComponent } from '../work-with-us/work-with-us.component';
import { BannerPrincipalComponent } from '../banner-principal/banner-principal.component';
import { RetainAttentionComponent } from '../retain-attention/retain-attention.component';
import { CoverageAreaComponent } from '../coverage-area/coverage-area.component';
import { WhoWeAreComponent } from '../who-we-are/who-we-are.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent {

  constructor(
    private router: Router
  ) {}

  @HostBinding('class') class = 'd-flex justify-content-center w-100'
  navBarMenu = navBarMenu

  goHome() {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        this.scrollTo('startBanner');
      }, 500);
    })
  }

  clickItemMenu(menu) {
    if (menu.url) {
      window.open(menu.url, '_blank')
    } else {
      this.scrollTo(menu.scrollTo)
    }
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

