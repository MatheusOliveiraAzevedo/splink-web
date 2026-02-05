import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { PrivacyCookiesComponent } from './pages/privacy-cookies/privacy-cookies.component';
import { RightsPolicyComponent } from './pages/rights-policy/rights-policy.component';

export const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      data: {title: 'SP-Link Internet Fibra Óptica', description: 'Internet fibra óptica residencial e empresarial com Wi-Fi 6, atendimento rápido e a melhor avaliação de Tramandaí e Imbé. 4.8 estrelas em Tramandaí e 5.0 em Imbé.'}
    },
    {
      path: 'politica-de-privacidade',
      component: PrivacyPolicyComponent,
      data: {title: 'SP-Link - Politica de privacidade'}
    },
    {
      path: 'politica-de-cookies',
      component: PrivacyCookiesComponent,
      data: {title: 'SP-Link - Politica de cookies'}
    },
    {
      path: 'politica-de-direito-dos-titulares',
      component: RightsPolicyComponent,
      data: {title: 'SP-Link - Politica de direito dos titulares'}
    },
    {
      path: 'erro-404',
      component: Error404Component,
      data: {title: 'SP-Link - Pagina não encontrada'}
    },
    {
      path: '',
      component: HomeComponent
    },
    { path: '**', redirectTo: 'erro-404' },
  ];