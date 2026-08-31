import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChampionService } from '../../core/services/champion.service';
import { Champion } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent {
  private championService = inject(ChampionService);

  champions = signal<Champion[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  totalVotes = computed(() =>
    this.champions().reduce((sum, c) => sum + c.voteCount, 0),
  );

  constructor() {
    this.championService.list('order').subscribe({
      next: (data) => {
        this.champions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos.');
        this.loading.set(false);
      },
    });
  }

  byStatus(status: Champion['status']): number {
    return this.champions().filter((c) => c.status === status).length;
  }
}