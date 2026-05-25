import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ProfessionalTableComponent } from '../../components/professional-table/professional-table';
import { Professional } from '../../models/professional.model';
import { ProfessionalApiService } from '../../services/professional-api.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-professionals-page',
  imports: [PageHeaderComponent, ProfessionalTableComponent],
  templateUrl: './professionals-page.html',
  styleUrl: './professionals-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalsPageComponent {
  private readonly professionalApiService = inject(ProfessionalApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly professionals = signal<Professional[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  constructor() {
    this.loadProfessionals();
  }

  private loadProfessionals(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.professionalApiService
      .list()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (professionals) => {
          this.professionals.set(professionals);
        },
        error: () => {
          this.professionals.set([]);
          this.errorMessage.set('Unable to load professionals right now. Check that the backend is running.');
        },
      });
  }
}
