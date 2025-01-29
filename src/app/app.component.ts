import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuBarComponent } from "./components/menu-bar/menu-bar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { Meta, Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuBarComponent, FooterComponent, CommonModule],
  providers: [Title, provideNgxMask()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  title = 'splink-web';
  public isMenuHidden = true
  lastScrollPosition = 50

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        this.titleService.setTitle(data['title'] || 'SP-LINK');
        
        if (data['description']) {
          this.metaService.updateTag({ name: 'description', content: data['description'] });
        }

        if (this.router.url === '/') {
          this.isMenuHidden = true
        } else {
          this.isMenuHidden = false
        }
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    
    if (this.router.url === '/') {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition < 50) {
        this.isMenuHidden = true;
      } else if (currentScrollPosition > this.lastScrollPosition) {
        this.isMenuHidden = false;
      }
      this.lastScrollPosition = currentScrollPosition;
    } else {
      this.isMenuHidden = false
    }

  }
}
