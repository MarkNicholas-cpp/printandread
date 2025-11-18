import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  // Phase 1: Legacy routes (kept for backward compatibility)
  {
    path: 'branches',
    loadComponent: () => import('./pages/branches/branches').then(m => m.Branches)
  },
  // Phase 2: New navigation flow
  {
    path: 'regulations/:branchId',
    loadComponent: () => import('./pages/regulations/regulations').then(m => m.Regulations)
  },
  {
    path: 'years/:branchId/:regulationId',
    loadComponent: () => import('./pages/years/years').then(m => m.Years)
  },
  {
    path: 'semesters/:branchId/:regulationId/:yearId',
    loadComponent: () => import('./pages/semesters/semesters').then(m => m.Semesters)
  },
  {
    path: 'subjects/:branchId/:regulationId/:yearId/:semesterId',
    loadComponent: () => import('./pages/subjects/subjects').then(m => m.Subjects)
  },
  // Materials and Viewer (unchanged, but route params may be used for breadcrumbs)
  {
    path: 'materials/:subjectId',
    loadComponent: () => import('./pages/materials/materials').then(m => m.Materials)
  },
  {
    path: 'viewer/:materialId',
    loadComponent: () => import('./pages/viewer/viewer').then(m => m.Viewer)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then(m => m.Search)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.Admin)
  },
  {
    path: 'login',
    redirectTo: '/home' // Placeholder - can be replaced with actual login component later
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
