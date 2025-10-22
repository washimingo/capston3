import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
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
    path: 'invoices',
    loadComponent: () => import('./pages/invoices/invoices.page').then( m => m.InvoicesPage)
  },
  
];