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
				redirectTo: 'dashboard'
			},
			{
				path: 'dashboard',
				loadChildren: () =>
					import('./features/dashboard/dashboard.routes').then((module) => module.dashboardRoutes)
			}
		]
	},
	{
		path: '**',
		redirectTo: ''
	}
];
