import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      data: {title: 'SP-Link - Home', description: 'SP-Link, Estabilidade para suas maratonas, reuniões e jogos online, com atendimento que faz a diferença.'}
    },
    {
      path: 'politica-de-privacidade',
      component: PrivacyPolicyComponent,
      data: {title: 'SP-Link - Politica de privacidade'}
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