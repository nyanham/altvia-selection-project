import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { primaryNavigation, secondaryNavigation } from '../../config/navigation.config';

@Component({
  selector: 'app-shell',
  imports: [
    MatDividerModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  protected readonly dashboardNavigationItem =
    secondaryNavigation.find((item) => item.route === '/dashboard') ?? null;

  protected readonly workflowNavigationItems = [
    ...primaryNavigation,
    ...secondaryNavigation.filter((item) => item.route !== '/dashboard'),
  ];
}
