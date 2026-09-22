import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly googleLoginUrl = `${environment.apiUrl}/api/auth/oauth-start?origin=admin`;

  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.loading()) return;
    this.error.set(null);
    this.loading.set(true);
    try {
      await this.auth.login(this.email(), this.password());
      if (!this.auth.isAdmin()) {
        await this.auth.logout();
        this.error.set('Esta cuenta no tiene permisos de administrador.');
        return;
      }
      this.router.navigate(['/dashboard']);
    } catch (e: unknown) {
      this.error.set(this.messageFor(e));
    } finally {
      this.loading.set(false);
    }
  }

  private messageFor(e: unknown): string {
    const status = (e as { status?: number })?.status;
    if (status === 401) return 'Credenciales inválidas.';
    if (status === 0) return 'No se pudo conectar con el servidor.';
    return 'Ha ocurrido un error. Inténtalo de nuevo.';
  }
}