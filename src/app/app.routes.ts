import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WorkWithUsComponent } from './components/work-with-us/work-with-us.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { WhoWeAreComponent } from './components/who-we-are/who-we-are.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    {
      path: 'home',
      component: HomeComponent,
      data: {title: 'Home - SP-Link', description: 'SP-Link, Estabilidade para suas maratonas, reuniões e jogos online, com atendimento que faz a diferença.'}
    },
    {
      path: 'politica-de-privacidade',
      component: PrivacyPolicyComponent,
      data: {title: 'Politica de privacidade - SP-Link'}
    },
    {
      path: 'erro-404',
      component: Error404Component,
      data: {title: 'Pagina não encontrada - SP-Link'}
    },
    {
      path: '',
      component: HomeComponent
    },
    { path: '**', redirectTo: 'erro-404' },
  ];