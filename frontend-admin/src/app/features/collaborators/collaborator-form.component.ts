import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CollaboratorService } from '../../core/services/collaborator.service';
import { UploadService } from '../../core/services/upload.service';
import {
  Collaborator,
  CollaboratorPayload,
  CollaboratorSocialPayload,
  SocialPlatform,
  SOCIAL_PLATFORM_LABEL,
} from '../../core/models/models';

@Component({
  selector: 'app-collaborator-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './collaborator-form.component.html',
  styleUrl: './collaborator-form.component.css',
})
export class CollaboratorFormComponent {
  private collaboratorService = inject(CollaboratorService);
  private uploadService = inject(UploadService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private editId = signal<number | null>(null);
  isEdit = computed(() => this.editId() !== null);

  loading = signal(true);
  saving = signal(false);
  uploading = signal(false);
  saveError = signal<string | null>(null);
  uploadError = signal<string | null>(null);

  // Opciones del desplegable de plataforma.
  readonly platforms = Object.entries(SOCIAL_PLATFORM_LABEL) as [SocialPlatform, string][];

  form: CollaboratorPayload = {
    name: '',
    photoUrl: null,
    bio: null,
    socials: [],
  };

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      this.collaboratorService.get(id).subscribe({
        next: (c) => {
          this.hydrate(c);
          this.loading.set(false);
        },
        error: () => {
          this.saveError.set('No se pudo cargar el colaborador.');
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }

  private hydrate(c: Collaborator): void {
    this.form = {
      name: c.name,
      photoUrl: c.photoUrl,
      bio: c.bio,
      // Copiamos solo platform y url: los id de social no se reenvían
      // (el backend regraba los socials en cada update).
      socials: c.socials.map((s) => ({ platform: s.platform, url: s.url })),
    };
  }

  addSocial(): void {
    this.form.socials.push({ platform: 'TWITCH', url: '' });
  }

  removeSocial(index: number): void {
    this.form.socials.splice(index, 1);
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadError.set(null);
    this.uploading.set(true);
    this.uploadService.uploadImage(file, 'collaborators').subscribe({
      next: (res) => {
        this.form.photoUrl = res.url;
        this.uploading.set(false);
      },
      error: (e: { status?: number }) => {
        this.uploadError.set(
          e.status === 413 ? 'La imagen supera los 5 MB.' : 'No se pudo subir la imagen.',
        );
        this.uploading.set(false);
      },
    });
  }

  save(): void {
    if (this.saving() || this.uploading()) return;
    this.saveError.set(null);
    this.saving.set(true);

    // Descarta socials vacíos (fila añadida pero sin URL).
    const payload: CollaboratorPayload = {
      ...this.form,
      socials: this.form.socials.filter((s) => s.url.trim() !== ''),
    };

    const req = this.isEdit()
      ? this.collaboratorService.update(this.editId()!, payload)
      : this.collaboratorService.create(payload);

    req.subscribe({
      next: () => this.router.navigate(['/collaborators']),
      error: () => {
        this.saveError.set('No se pudo guardar. Revisa los datos e inténtalo de nuevo.');
        this.saving.set(false);
      },
    });
  }
}