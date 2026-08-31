import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../app.config';
import { Collaborator } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private http = inject(HttpClient);
  private readonly base = `${API_URL}/api/collaborators`;

  list(): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(this.base);
  }
}