import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../app.config';
import { Champion, ChampionPayload } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ChampionService {
  private http = inject(HttpClient);
  private readonly base = `${API_URL}/api/champions`;

  list(sort?: 'votes' | 'winratio' | 'order'): Observable<Champion[]> {
    const url = sort ? `${this.base}?sort=${sort}` : this.base;
    return this.http.get<Champion[]>(url);
  }

  get(id: number): Observable<Champion> {
    return this.http.get<Champion>(`${this.base}/${id}`);
  }

  create(payload: ChampionPayload): Observable<Champion> {
    return this.http.post<Champion>(this.base, payload);
  }

  update(id: number, payload: ChampionPayload): Observable<Champion> {
    return this.http.put<Champion>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}