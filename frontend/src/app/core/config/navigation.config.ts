export interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

export const primaryNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'space_dashboard'
  }
];