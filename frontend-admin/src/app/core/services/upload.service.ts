import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UploadResult } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);

  /**
   * Sube una imagen al proxy del backend, que la firma y la manda a Cloudinary.
   * folder decide la carpeta destino ('champions' | 'collaborators').
   */
  uploadImage(file: File, folder: 'champions' | 'collaborators'): Observable<UploadResult> {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    return this.http.post<UploadResult>(`${environment.apiUrl}/api/uploads/image`, form);
  }
}