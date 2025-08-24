import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user.page').then( m => m.UserPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.page').then( m => m.ReportsPage)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./invoices/invoices.page').then( m => m.InvoicesPage)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./alerts/alerts.page').then( m => m.AlertsPage)
  },
  {
    path: 'facturas-por-vencer',
    loadComponent: () => import('./invoices/facturas-por-vencer/facturas-por-vencer.page').then( m => m.FacturasPorVencerPage)
  },

];
