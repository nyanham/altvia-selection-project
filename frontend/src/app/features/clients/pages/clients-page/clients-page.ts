import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClientTableComponent } from '../../components/client-table/client-table';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-clients-page',
  imports: [ClientTableComponent, PageHeaderComponent],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsPageComponent {
}