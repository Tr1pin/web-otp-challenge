import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../app.config';
import { AuthResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _ready = signal(false);

  readonly user = this._user.asReadonly();
  readonly ready = this._ready.asReadonly();
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');
  readonly isAuthenticated = computed(() => this._user() !== null);


  get token(): string | null {
    return this._token();
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      ),
    );
    this._token.set(res.token);
    this._user.set(res.user);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true }),
      );
    } finally {
      this._token.set(null);
      this._user.set(null);
    }
  }

  async restore(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<User>(`${API_URL}/api/auth/me`, { withCredentials: true }),
      );
      this._user.set(user);
    } catch {
      this._user.set(null);
    } finally {
      this._ready.set(true);
    }
  }
}