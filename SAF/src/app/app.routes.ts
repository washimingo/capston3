import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full',
  },
  {
    path: 'authentication',
    loadComponent: () => import('./pages/authentication/authentication.page').then( m => m.AuthenticationPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.page').then( m => m.UserPage),
    canActivate: [authGuard]
  },
  {
    path: 'tips',
    loadComponent: () => import('./pages/tips/tips.page').then( m => m.TipsPage),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.page').then( m => m.ReportsPage),
    canActivate: [authGuard]
  },
  {
    path: 'invoices',
    loadComponent: () => import('./pages/invoices/invoices.page').then( m => m.InvoicesPage),
    canActivate: [authGuard]
  }
];