import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuBarComponent } from "./components/menu-bar/menu-bar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs';
import { register } from 'swiper/element';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuBarComponent, FooterComponent],
  providers: [Title],
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
        // Atualiza o título da aba
        this.titleService.setTitle(data['title'] || 'SP-LINK');
        
        // Atualiza a meta descrição, se estiver no data
        if (data['description']) {
          this.metaService.updateTag({ name: 'description', content: data['description'] });
        }
      });
      register();
  }
}
