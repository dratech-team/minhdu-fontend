import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/trang-chu',
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
    url: '/trang-chu/ho-so',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Lương bổng'
  },
  {
    name: 'Phiếu lương',
    url: '/trang-chu/phieu-luong',
    icon: 'cil-lock-locked'
  },
  {
    name: 'Bản mẫu',
    url: '/trang-chu/phieu-luong/ban-mau',
    icon: 'cil-lock-locked'
  },
  {
    name: 'Ngày lễ',
    url: '/trang-chu/phieu-luong/ngay-le',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Sơ đồ'
  },
  {
    name: 'Tổ chức',
    url: '/trang-chu/to-chuc',
    icon: 'cil-lock-locked'
  }
];
