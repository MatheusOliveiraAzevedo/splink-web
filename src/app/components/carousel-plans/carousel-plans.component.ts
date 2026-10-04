import { Component, HostBinding, inject, OnInit, OnDestroy } from '@angular/core';
import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { includedInAllPlans, Plan, plans, configurationCarrousel } from '../../shared/model/plans';
import { GeneralUtils } from '../../shared/generalutils';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-carousel-plans',
  standalone: true,
  imports: [CarouselModule, CurrencyPipe],
  templateUrl: './carousel-plans.component.html',
  styleUrl: './carousel-plans.component.scss'
})
export class CarouselPlansComponent implements OnInit, OnDestroy {

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6'
  plans = plans;
  included = includedInAllPlans;
  generalUtils = new GeneralUtils;
  responsiveOptions = configurationCarrousel;

  private document = inject(DOCUMENT);
  private structuredData?: HTMLScriptElement;

  ngOnInit(): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'plans-structured-data';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': this.plans.map(plan => ({
        '@type': 'Product',
        name: `${plan.name} – SP-Link`,
        description: `${plan.description}${plan.price === null ? ' Valor sob consulta.' : ''}`,
        brand: { '@type': 'Brand', name: 'SP-Link' },
        category: 'Internet Fibra Óptica',
        url: 'https://sp-link.com.br/#plans',
        ...(plan.price !== null ? {
          offers: {
            '@type': 'Offer',
            price: plan.price.toFixed(2),
            priceCurrency: 'BRL',
            url: 'https://sp-link.com.br/#plans',
          },
        } : {}),
      })),
    });
    this.document.head.appendChild(script);
    this.structuredData = script;
  }

  ngOnDestroy(): void {
    this.structuredData?.remove();
  }

  goToWhatsApp(plan: Plan) {
    this.generalUtils.abrirWhatsApp({ position: 'plans', plan });
  }
}
