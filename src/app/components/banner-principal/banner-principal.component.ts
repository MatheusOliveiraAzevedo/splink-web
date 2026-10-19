import { AfterViewInit, Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { GooglePlacesService, PlaceDetails } from '../google-reviews/google-places.service';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { CarouselTouchDirectionDirective } from '../carousel-plans/carousel-touch-direction.directive';
import { links } from '../../shared/model/links';

@Component({
  selector: 'app-banner-principal', standalone: true, imports: [CarouselModule, CarouselTouchDirectionDirective],
  templateUrl: './banner-principal.component.html', styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent implements OnInit, AfterViewInit {
  @ViewChild(Carousel) carousel!: Carousel;
  readonly slides = [
    { id: 'reviews', image: 'assets/banner/familia-aberta', width: 1512, height: 1040,
      alt: 'Família sorrindo e usando celulares, tablet e notebook conectados à internet' },
    { id: 'internet', image: 'assets/banner/familia-aberta', width: 1512, height: 1040,
      alt: 'Família sorrindo e usando celulares, tablet e notebook conectados à internet' },
  ];
  page = 0;
  readonly ratings = signal<{ name: string; url: string; details?: PlaceDetails }[]>([
    { name: 'Tramandaí', url: links.endereco_01 }, { name: 'Imbé', url: links.endereco_02 },
  ]);
  private readonly places = inject(GooglePlacesService);
  private readonly destroyRef = inject(DestroyRef);
  private destroyed = false;

  ngOnInit(): void {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { if (motion.matches) this.carousel?.stopAutoplay(); };
    const onVisibility = () => { if (document.hidden) this.carousel?.stopAutoplay(); };
    motion.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    // Yield to the initial render without adding a fixed wait before the visible ratings.
    const load = setTimeout(() => { void this.loadRatings(); }, 0);
    this.destroyRef.onDestroy(() => {
      this.destroyed = true; clearTimeout(load);
      motion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) queueMicrotask(() => this.carousel.stopAutoplay());
  }

  toggle(): void { this.carousel.isPlaying() ? this.carousel.stopAutoplay() : this.carousel.startAutoplay(); }
  focus(event: FocusEvent): void {
    if (!(event.target instanceof Element) || !event.target.closest('.hero__pause')) this.carousel?.stopAutoplay();
  }
  pauseOnHover(): void { if (window.matchMedia('(hover: hover)').matches) this.carousel?.stopAutoplay(); }
  rating(value: number): string { return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 }); }
  safeUrl(value?: string): string | null {
    try { const url = new URL(value ?? ''); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
  }

  private async loadRatings(): Promise<void> {
    try {
      const config = await this.places.configuration();
      if (this.destroyed || !config.apiKey?.trim()) return;
      await Promise.all((['tramandai', 'imbe'] as const).map(async (id, index) => {
        if (!config.placeIds?.[id]) return;
        try {
          const details = await this.places.summary(config.apiKey, config.placeIds[id]);
          if (!this.destroyed) this.ratings.update(items => items.map((item, i) => i === index ? { ...item, details } : item));
        } catch { /* Keep the verified profile link available without inventing a rating. */ }
      }));
    } catch { /* The existing slide and profile links remain usable. */ }
  }
}
