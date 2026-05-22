import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfessionalTableComponent } from '../../components/professional-table/professional-table';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-professionals-page',
  imports: [PageHeaderComponent, ProfessionalTableComponent],
  templateUrl: './professionals-page.html',
  styleUrl: './professionals-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalsPageComponent {
}