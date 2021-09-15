import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '',
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
    url: '/ho-so',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Lương bổng'
  },
  {
    name: 'Phiếu lương',
    url: '/phieu-luong',
    icon: 'cil-lock-locked'
  },
  {
    name: 'bản mẫu',
    url: '/phieu-luong/ban-mau',
    icon: 'cil-lock-locked'
  },
  {
    name: 'Ngày lễ',
    url: '/phieu-luong/ngay-le',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Sơ đồ'
  },
  {
    name: 'Tổ chức',
    url: '/to-chuc',
    icon: 'cil-lock-locked'
  }
];
