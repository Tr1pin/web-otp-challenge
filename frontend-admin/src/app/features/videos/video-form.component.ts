import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideoService } from '../../core/services/video.service';
import { ChampionService } from '../../core/services/champion.service';
import { Video, VideoPayload, Champion } from '../../core/models/models';

@Component({
  selector: 'app-video-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.css',
})
export class VideoFormComponent {
  private videoService = inject(VideoService);
  private championService = inject(ChampionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private editId = signal<number | null>(null);
  isEdit = computed(() => this.editId() !== null);

  loading = signal(true);
  saving = signal(false);
  saveError = signal<string | null>(null);

  champions = signal<Champion[]>([]);
  championId: number | null = null;

  form: Omit<VideoPayload, 'champion'> = {
    youtubeId: '',
    title: '',
    orderIndex: 0,
  };

  constructor() {
    // Cargamos los campeones para el desplegable (obligatorio elegir uno).
    this.championService.list('order').subscribe({
      next: (data) => this.champions.set(data),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      this.videoService.get(id).subscribe({
        next: (v) => {
          this.hydrate(v);
          this.loading.set(false);
        },
        error: () => {
          this.saveError.set('No se pudo cargar el vídeo.');
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }

  private hydrate(v: Video): void {
    this.form = {
      youtubeId: v.youtubeId,
      title: v.title,
      orderIndex: v.orderIndex,
    };
  }

  save(): void {
    if (this.saving()) return;
    this.saveError.set(null);

    if (!this.championId) {
      this.saveError.set('Debes asociar el vídeo a un champion.');
      return;
    }

    this.saving.set(true);

    const payload: VideoPayload = {
      ...this.form,
      orderIndex: Number(this.form.orderIndex) || 0,
      champion: { id: this.championId },
    };

    const req = this.isEdit()
      ? this.videoService.update(this.editId()!, payload)
      : this.videoService.create(payload);

    req.subscribe({
      next: () => this.router.navigate(['/videos']),
      error: () => {
        this.saveError.set('No se pudo guardar. Revisa los datos e inténtalo de nuevo.');
        this.saving.set(false);
      },
    });
  }
}