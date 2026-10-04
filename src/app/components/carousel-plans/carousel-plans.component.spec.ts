import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CarouselPlansComponent } from './carousel-plans.component';

registerLocaleData(localePt, 'pt-BR');

describe('CarouselPlansComponent', () => {
  let component: CarouselPlansComponent;
  let fixture: ComponentFixture<CarouselPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselPlansComponent],
      providers: [provideNoopAnimations(), { provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();
    fixture = TestBed.createComponent(CarouselPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders selectable plan details and highlights 500 Mega inside the carousel', () => {
    const carousel = fixture.nativeElement.querySelector('p-carousel');
    const cards: HTMLElement[] = Array.from(carousel.querySelectorAll('article'));
    expect(cards.length).toBe(component.plans.length);
    const highlighted = carousel.querySelector('.plan-card--highlight');
    expect(highlighted.textContent).toContain('500');
    expect(highlighted.textContent).toContain('119,90');
    expect(highlighted.textContent).toContain('Upload');
    expect(highlighted.textContent).toContain('Watch TV');
    expect(highlighted.textContent).toContain('Instalação gratuita');
    expect(highlighted.textContent).toContain('Fidelidade de 12 meses');
  });

  it('keeps structured prices in sync and never publishes consultation plans as free', () => {
    const script = document.getElementById('plans-structured-data')!;
    const products = JSON.parse(script.textContent!)['@graph'];
    component.plans.forEach((plan, index) => {
      if (plan.price === null) {
        expect(products[index].offers).toBeUndefined();
        expect(products[index].description).toContain('Valor sob consulta');
      } else {
        expect(products[index].offers.price).toBe(plan.price.toFixed(2));
        expect(products[index].offers.priceCurrency).toBe('BRL');
      }
    });
  });

  it('removes its structured data when leaving the home page', () => {
    fixture.destroy();
    expect(document.getElementById('plans-structured-data')).toBeNull();
  });

  it('opens WhatsApp with the chosen plan', () => {
    spyOn(component.generalUtils, 'registrarCliqueWhatsApp');
    const open = spyOn(window, 'open');
    component.goToWhatsApp(component.plans[2]);
    expect(decodeURIComponent(open.calls.mostRecent().args[0] as string)).toContain('500 Mega');
    expect(component.generalUtils.registrarCliqueWhatsApp).toHaveBeenCalledWith({ position: 'plans', plan: component.plans[2] });
  });
});
