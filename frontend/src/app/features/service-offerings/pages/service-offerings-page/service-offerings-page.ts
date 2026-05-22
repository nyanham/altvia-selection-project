import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { ServiceOfferingTableComponent } from '../../components/service-offering-table/service-offering-table';

@Component({
  selector: 'app-service-offerings-page',
  imports: [PageHeaderComponent, ServiceOfferingTableComponent],
  templateUrl: './service-offerings-page.html',
  styleUrl: './service-offerings-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceOfferingsPageComponent {
}