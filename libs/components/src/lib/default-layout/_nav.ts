import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: '',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      title: true,
      name: 'Nhân sự',
    },
    {
      name: 'Nhân viên',
      url: '/employee',
      icon: 'cil-lock-locked',
    },
    {
      title: true,
      name: 'Lương bổng',
    },
    {
      name: 'Phiếu lương',
      url: '/payroll',
      icon: 'cil-lock-locked',
      children: [
        {
          name: 'Danh sách lương',
          url: '/payroll/payrolls',
          icon: 'cil-lock-locked',
        },
      ],
    },
    {
      title: true,
      name: 'Sơ đồ',
    },
    {
      name: 'Tổ chức',
      url: '/org-chart',
      icon: 'cil-lock-locked',
    },
  ];