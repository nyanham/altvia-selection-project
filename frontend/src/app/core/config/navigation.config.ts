export interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

export const primaryNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'space_dashboard',
  },
  {
    label: 'Appointments',
    route: '/appointments',
    icon: 'calendar_month'
  },
  {
    label: 'Clients',
    route: '/clients',
    icon: 'groups'
  },
  {
    label: 'Professionals',
    route: '/professionals',
    icon: 'badge'
  },
  {
    label: 'Services',
    route: '/services',
    icon: 'content_cut'
  },
];
