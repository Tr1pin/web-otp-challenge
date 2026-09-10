import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../app/features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'champions',
        loadComponent: () =>
          import('../app/features/champions/champion-list.component').then(
            (m) => m.ChampionListComponent,
          ),
      },
      {
        path: 'champions/new',
        loadComponent: () =>
          import('../app/features/champions/champion-form.component').then(
            (m) => m.ChampionFormComponent,
          ),
      },
      {
        path: 'champions/:id',
        loadComponent: () =>
          import('../app/features/champions/champion-form.component').then(
            (m) => m.ChampionFormComponent,
          ),
      },
      {
        path: 'collaborators',
        loadComponent: () =>
          import('../app/features/collaborators/collaborator-list.component').then(
            (m) => m.CollaboratorListComponent,
          ),
      },
      {
        path: 'collaborators/new',
        loadComponent: () =>
          import('./features/collaborators/collaborator-form.component').then(
            (m) => m.CollaboratorFormComponent,
          ),
      },
      {
        path: 'collaborators/:id',
        loadComponent: () =>
          import('./features/collaborators/collaborator-form.component').then(
            (m) => m.CollaboratorFormComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];