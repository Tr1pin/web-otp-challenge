import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})

export class AdminLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  readonly nav = [
    { path: '/dashboard', label: 'Resumen', tag: '01', exact: true },
    { path: '/champions', label: 'Champions', tag: '02', exact: false },
    { path: '/collaborators', label: 'Colaboradores', tag: '03', exact: false },
    { path: '/videos', label: 'Vídeos', tag: '04', exact: false },
  ];

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}