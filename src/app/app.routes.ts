import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WorkWithUsComponent } from './pages/work-with-us/work-with-us.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { WhoWeAreComponent } from './pages/who-we-are/who-we-are.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'trabalhe-conosco',
      component: WorkWithUsComponent
    },
    {
      path: 'quem-somos',
      component: WhoWeAreComponent
    },
    {
      path: 'politica-de-privacidade',
      component: PrivacyPolicyComponent
    },
    {
      path: 'erro-404',
      component: Error404Component
    },
    {
      path: '',
      component: HomeComponent
    },
    { path: '**', redirectTo: 'erro-404' },
  ];