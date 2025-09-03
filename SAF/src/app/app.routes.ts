import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./templates/home/home.page').then( m => m.HomePage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'test-api',
    loadComponent: () => import('./templates/test-api/test-api.page').then( m => m.TestApiPage)
  },
  {
    path: 'usuario',
    loadComponent: () => import('./templates/usuario/usuario.page').then( m => m.UsuarioPage)
  },
  {
    path: 'tips-ayuda',
    loadComponent: () => import('./templates/tips-ayuda/tips-ayuda.page').then( m => m.TipsAyudaPage)
  },
  {
    path: 'reports',
    loadComponent: () => import('./templates/reports/reports.page').then( m => m.ReportsPage)
  },
  {
    path: 'dashboards',
    loadComponent: () => import('./templates/dashboards/dashboards.page').then( m => m.DashboardsPage)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./templates/invoices/invoices.page').then( m => m.InvoicesPage)
  },
];