import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.page').then( m => m.UserPage)
  },
  {
    path: 'tips',
    loadComponent: () => import('./pages/tips/tips.page').then( m => m.TipsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.page').then( m => m.ReportsPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./pages/invoices/invoices.page').then( m => m.InvoicesPage)
  },
  {
    path: 'asistente-ia',
    loadComponent: () => import('./pages/asistente-ia/asistente-ia.page').then( m => m.AsistenteIaPage)
  }
];