import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../app.config';
import { Video, VideoPayload } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private http = inject(HttpClient);
  private readonly base = `${API_URL}/api/videos`;

  list(): Observable<Video[]> {
    return this.http.get<Video[]>(this.base);
  }

  get(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.base}/${id}`);
  }

  create(payload: VideoPayload): Observable<Video> {
    return this.http.post<Video>(this.base, payload);
  }

  update(id: number, payload: VideoPayload): Observable<Video> {
    return this.http.put<Video>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
  
}