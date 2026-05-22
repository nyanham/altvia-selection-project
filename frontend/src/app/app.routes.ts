import { Routes } from '@angular/router';
import { AppShellComponent } from './core/layout/app-shell/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((module) => module.dashboardRoutes)
      },
      {
        path: 'appointments',
        loadChildren: () =>
          import('./features/appointments/appointments.routes').then(
            (module) => module.appointmentsRoutes
          )
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./features/clients/clients.routes').then((module) => module.clientsRoutes)
      },
      {
        path: 'professionals',
        loadChildren: () =>
          import('./features/professionals/professionals.routes').then(
            (module) => module.professionalsRoutes
          )
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./features/service-offerings/service-offerings.routes').then(
            (module) => module.serviceOfferingsRoutes
          )
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
