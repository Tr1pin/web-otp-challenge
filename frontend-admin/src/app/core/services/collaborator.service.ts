import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Collaborator, CollaboratorPayload } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/collaborators`;

  list(): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(this.base);
  }

  get(id: number): Observable<Collaborator> {
    return this.http.get<Collaborator>(`${this.base}/${id}`);
  }

  create(payload: CollaboratorPayload): Observable<Collaborator> {
    return this.http.post<Collaborator>(this.base, payload);
  }

  update(id: number, payload: CollaboratorPayload): Observable<Collaborator> {
    return this.http.put<Collaborator>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
  
}