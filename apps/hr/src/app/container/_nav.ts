import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: '',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Nhân sự'
  },
  {
    name: 'Hồ sơ',
    url: '/profile',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Lương bổng'
  },
  {
    name: 'Phiếu lương',
    url: '/payroll',
    icon: 'cil-lock-locked'
  },
  {
    name: 'bản mẫu',
    url: '/payroll/template',
    icon: 'cil-lock-locked'
  },
  {
    name: 'Ngày lễ',
    url: '/payroll/holiday',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Sơ đồ'
  },
  {
    name: 'Tổ chức',
    url: '/org-chart',
    icon: 'cil-lock-locked'
  }
];
