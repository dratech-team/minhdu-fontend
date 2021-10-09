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
    title: true,
    name: 'Bản Mẫu'
  },
  {
    name: 'Lương cơ bản',
    url: '/ban-mau',
    icon: 'cil-lock-locked'
  },
  {
    name: 'Tăng ca',
    url: '/ban-mau/tang-ca',
    icon: 'cil-lock-locked'
  },
  {
    name: 'Ngày lễ',
    url: '/ban-mau/ngay-le',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Hệ thống'
  },
  {
    name: 'Lịch sử hệ thống',
    url: '/lich-su-he-thong',
    icon: 'cil-lock-locked'
  },
];
