import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPrincipalComponent } from './banner-principal.component';

describe('BannerPrincipalComponent', () => {
  let component: BannerPrincipalComponent;
  let fixture: ComponentFixture<BannerPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerPrincipalComponent);
    component = fixture.componentInstance;
  });

  it('keeps only the internet banner until marketing supplies the artwork', () => {
    fixture.detectChanges();
    expect(component.slides.map(slide => slide.id)).toEqual(['internet']);
    expect(fixture.nativeElement.querySelector('.hero__title').textContent).toContain('rápida de verdade');
    expect(fixture.nativeElement.querySelector('.hero__pause')).toBeNull();
    expect(fixture.nativeElement.querySelector('.hero__artwork')).toBeNull();
  });

  it('renders responsive artwork with its escaped, screen-reader-accessible transcription', () => {
    const description = 'Arte de teste: Tramandaí, <nota confirmada>; Imbé, <nota confirmada>. Data de conferência.';
    component.slides.unshift({ id: 'google-ratings', artwork: {
      desktop: 'assets/banner/test-desktop.webp', tablet: 'assets/banner/test-tablet.webp',
      mobile: 'assets/banner/test-mobile.webp', description,
    } });
    fixture.detectChanges();

    const figure = fixture.nativeElement.querySelector('.hero__artwork');
    expect(figure.querySelector('img').getAttribute('src')).toBe('assets/banner/test-desktop.webp');
    expect(figure.querySelector('source[media="(max-width: 575px)"]').getAttribute('srcset')).toBe('assets/banner/test-mobile.webp');
    expect(figure.querySelector('source[media="(max-width: 991px)"]').getAttribute('srcset')).toBe('assets/banner/test-tablet.webp');
    expect(figure.querySelector('figcaption').textContent).toBe(description);
    expect(figure.querySelector('figcaption').classList.contains('visually-hidden')).toBeTrue();
    expect(figure.querySelector('figcaption').hasAttribute('aria-hidden')).toBeFalse();
    expect(figure.querySelector('nota')).toBeNull();
    expect(fixture.nativeElement.querySelector('.hero__pause')).not.toBeNull();

    component.page = 1;
    fixture.detectChanges();
    expect(figure.closest('[data-slide]').hasAttribute('inert')).toBeTrue();
  });
});
