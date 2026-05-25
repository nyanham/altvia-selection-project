import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { ServiceOfferingTableComponent } from '../../components/service-offering-table/service-offering-table';
import { ServiceOffering } from '../../models/service-offering.model';
import { ServiceOfferingApiService } from '../../services/service-offering-api.service';

@Component({
  selector: 'app-service-offerings-page',
  imports: [PageHeaderComponent, ServiceOfferingTableComponent],
  templateUrl: './service-offerings-page.html',
  styleUrl: './service-offerings-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOfferingsPageComponent {
  private readonly serviceOfferingApiService = inject(ServiceOfferingApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly serviceOfferings = signal<ServiceOffering[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  constructor() {
    this.loadServiceOfferings();
  }

  private loadServiceOfferings(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.serviceOfferingApiService
      .list()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (serviceOfferings) => {
          this.serviceOfferings.set(serviceOfferings);
        },
        error: () => {
          this.serviceOfferings.set([]);
          this.errorMessage.set(
            'Unable to load services right now. Check that the backend is running.',
          );
        },
      });
  }
}
