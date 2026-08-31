import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChampionService } from '../../core/services/champion.service';
import { CollaboratorService } from '../../core/services/collaborator.service';
import { UploadService } from '../../core/services/upload.service';
import {
  Champion,
  ChampionPayload,
  ChampionStatus,
  Collaborator,
} from '../../core/models/models';

@Component({
  selector: 'app-champion-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './champion-form.component.html',
  styles: [
    `
      .input {
        width: 100%;
        border-radius: 0.375rem;
        background: var(--color-ink-800);
        border: 1px solid var(--color-ink-600);
        padding: 0.625rem 0.75rem;
        color: var(--color-mist-100);
        font-size: 0.875rem;
        outline: none;
        transition: border-color 0.15s;
      }
      .input:focus {
        border-color: var(--color-gold-500);
      }
      .input::placeholder {
        color: var(--color-mist-500);
      }
    `,
  ],
})

export class ChampionFormComponent {
  private championService = inject(ChampionService);
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

  collaborators = signal<Collaborator[]>([]);
  collaboratorId: number | null = null;

  form: Omit<ChampionPayload, 'collaborator'> = {
    name: '',
    championKey: null,
    photoUrl: null,
    winRatio: null,
    wins: 0,
    losses: 0,
    notes: null,
    orderIndex: 0,
    status: 'PENDING' as ChampionStatus,
  };

  constructor() {
    this.collaboratorService.list().subscribe({
      next: (data) => this.collaborators.set(data),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      this.championService.get(id).subscribe({
        next: (c) => {
          this.hydrate(c);
          this.loading.set(false);
        },
        error: () => {
          this.saveError.set('No se pudo cargar el champion.');
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }

  private hydrate(c: Champion): void {
    this.form = {
      name: c.name,
      championKey: c.championKey,
      photoUrl: c.photoUrl,
      winRatio: c.winRatio,
      wins: c.wins,
      losses: c.losses,
      notes: c.notes,
      orderIndex: c.orderIndex,
      status: c.status,
    };
    this.collaboratorId = c.collaborator?.id ?? null;
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadError.set(null);
    this.uploading.set(true);
    this.uploadService.uploadImage(file, 'champions').subscribe({
      next: (res) => {
        this.form.photoUrl = res.url;
        this.uploading.set(false);
      },
      error: (e: { status?: number }) => {
        this.uploadError.set(
          e.status === 413
            ? 'La imagen supera los 5 MB.'
            : 'No se pudo subir la imagen.',
        );
        this.uploading.set(false);
      },
    });
  }

  save(): void {
    if (this.saving() || this.uploading()) return;
    this.saveError.set(null);
    this.saving.set(true);

    const payload: ChampionPayload = {
      ...this.form,
      wins: Number(this.form.wins) || 0,
      losses: Number(this.form.losses) || 0,
      orderIndex: Number(this.form.orderIndex) || 0,
      collaborator: this.collaboratorId ? { id: this.collaboratorId } : null,
    };

    const req = this.isEdit()
      ? this.championService.update(this.editId()!, payload)
      : this.championService.create(payload);

    req.subscribe({
      next: () => this.router.navigate(['/champions']),
      error: () => {
        this.saveError.set('No se pudo guardar. Revisa los datos e inténtalo de nuevo.');
        this.saving.set(false);
      },
    });
  }
}