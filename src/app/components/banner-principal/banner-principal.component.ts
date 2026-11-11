import { AfterViewInit, Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { CarouselTouchDirectionDirective } from '../carousel-plans/carousel-touch-direction.directive';
import { GoogleRatingsArtwork, googleRatingsArtwork } from './google-ratings-artwork';

type HeroSlide =
  | { id: 'google-ratings'; artwork: GoogleRatingsArtwork }
  | { id: 'internet'; image: string; width: number; height: number; alt: string };

@Component({
  selector: 'app-banner-principal', standalone: true, imports: [CarouselModule, CarouselTouchDirectionDirective],
  templateUrl: './banner-principal.component.html', styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent implements OnInit, AfterViewInit {
  @ViewChild(Carousel) carousel!: Carousel;
  readonly slides: HeroSlide[] = [
    ...(googleRatingsArtwork ? [{ id: 'google-ratings' as const, artwork: googleRatingsArtwork }] : []),
    { id: 'internet', image: 'assets/banner/familia-aberta', width: 1512, height: 1040,
      alt: 'Família sorrindo e usando celulares, tablet e notebook conectados à internet' },
  ];
  page = 0;
  readonly playing = signal(false);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.playing.set(this.slides.length > 1 && !motion.matches);
    const onMotion = () => { if (motion.matches) this.pause(); };
    const onVisibility = () => { if (document.hidden) this.pause(); };
    motion.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    this.destroyRef.onDestroy(() => {
      motion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.pause();
  }

  toggle(): void {
    if (this.carousel.isPlaying()) this.pause();
    else { this.carousel.startAutoplay(); this.playing.set(true); }
  }
  focus(event: FocusEvent): void {
    if (!(event.target instanceof Element) || !event.target.closest('.hero__pause')) this.pause();
  }
  pauseOnHover(): void { if (window.matchMedia('(hover: hover)').matches) this.pause(); }
  private pause(): void { this.carousel?.stopAutoplay(); this.playing.set(false); }
}
