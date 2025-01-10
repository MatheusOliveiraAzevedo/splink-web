import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WorkWithUsComponent } from './pages/work-with-us/work-with-us.component';
import { Error404Component } from './pages/error-404/error-404.component';

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
      path: 'erro-404',
      component: Error404Component
    },
    {
      path: '',
      component: HomeComponent
    },
    { path: '**', redirectTo: 'erro-404' },
  ];