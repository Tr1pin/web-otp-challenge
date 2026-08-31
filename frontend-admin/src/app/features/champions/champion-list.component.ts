import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChampionService } from '../../core/services/champion.service';
import { Champion, CHAMPION_STATUS_LABEL } from '../../core/models/models';

@Component({
  selector: 'app-champion-list',
  imports: [RouterLink],
  templateUrl: './champion-list.component.html',
})
export class ChampionListComponent {
  private championService = inject(ChampionService);

  champions = signal<Champion[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  confirmingId = signal<number | null>(null);
  deleting = signal(false);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.championService.list('order').subscribe({
      next: (data) => {
        this.champions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los champions.');
        this.loading.set(false);
      },
    });
  }

  remove(c: Champion): void {
    this.deleting.set(true);
    this.championService.remove(c.id).subscribe({
      next: () => {
        this.champions.update((list) => list.filter((x) => x.id !== c.id));
        this.confirmingId.set(null);
        this.deleting.set(false);
      },
      error: () => {
        this.error.set(`No se pudo eliminar "${c.name}".`);
        this.deleting.set(false);
      },
    });
  }

  label(s: Champion['status']): string {
    return CHAMPION_STATUS_LABEL[s];
  }

  dotClass(s: Champion['status']): string {
    return {
      COMPLETED: 'bg-ok',
      IN_PROGRESS: 'bg-warn',
      PENDING: 'bg-idle',
    }[s];
  }
}