import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CollaboratorService } from '../../core/services/collaborator.service';
import { Collaborator } from '../../core/models/models';

@Component({
  selector: 'app-collaborator-list',
  imports: [RouterLink],
  templateUrl: './collaborator-list.component.html',
})
export class CollaboratorListComponent {
  private collaboratorService = inject(CollaboratorService);

  collaborators = signal<Collaborator[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  confirmingId = signal<number | null>(null);
  deleting = signal(false);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.collaboratorService.list().subscribe({
      next: (data) => {
        this.collaborators.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los colaboradores.');
        this.loading.set(false);
      },
    });
  }

  remove(c: Collaborator): void {
    this.deleting.set(true);
    this.collaboratorService.remove(c.id).subscribe({
      next: () => {
        this.collaborators.update((list) => list.filter((x) => x.id !== c.id));
        this.confirmingId.set(null);
        this.deleting.set(false);
      },
      error: () => {
        this.error.set(`No se pudo eliminar "${c.name}".`);
        this.deleting.set(false);
      },
    });
  }
}