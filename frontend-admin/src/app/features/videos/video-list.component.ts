import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VideoService } from '../../core/services/video.service';
import { Video } from '../../core/models/models';

@Component({
  selector: 'app-video-list',
  imports: [RouterLink],
  templateUrl: './video-list.component.html',
})
export class VideoListComponent {
  private videoService = inject(VideoService);

  videos = signal<Video[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  confirmingId = signal<number | null>(null);
  deleting = signal(false);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.videoService.list().subscribe({
      next: (data) => {
        this.videos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los vídeos.');
        this.loading.set(false);
      },
    });
  }

  remove(v: Video): void {
    this.deleting.set(true);
    this.videoService.remove(v.id).subscribe({
      next: () => {
        this.videos.update((list) => list.filter((x) => x.id !== v.id));
        this.confirmingId.set(null);
        this.deleting.set(false);
      },
      error: () => {
        this.error.set(`No se pudo eliminar "${v.title}".`);
        this.deleting.set(false);
      },
    });
  }
}