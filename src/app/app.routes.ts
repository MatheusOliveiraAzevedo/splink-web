import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      data: {title: 'SP-Link Internet Fibra Óptica', description: 'Internet fibra óptica residencial e empresarial com Wi-Fi 6, atendimento rápido e a melhor avaliação de Tramandaí e Imbé. 4.8 estrelas em Tramandaí e 5.0 em Imbé.'}
    },
    {
      path: 'politica-de-privacidade',
      loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
      data: {title: 'SP-Link - Politica de privacidade'}
    },
    {
      path: 'politica-de-cookies',
      loadComponent: () => import('./pages/privacy-cookies/privacy-cookies.component').then(m => m.PrivacyCookiesComponent),
      data: {title: 'SP-Link - Politica de cookies'}
    },
    {
      path: 'politica-de-direito-dos-titulares',
      loadComponent: () => import('./pages/rights-policy/rights-policy.component').then(m => m.RightsPolicyComponent),
      data: {title: 'SP-Link - Politica de direito dos titulares'}
    },
    {
      path: 'erro-404',
      loadComponent: () => import('./pages/error-404/error-404.component').then(m => m.Error404Component),
      data: {title: 'SP-Link - Pagina não encontrada'}
    },
    { path: '**', redirectTo: 'erro-404' },
  ];