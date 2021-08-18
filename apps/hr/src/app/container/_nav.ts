import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/nhan-su',
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
    url: '/nhan-su/ho-so',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Lương bổng'
  },
  {
    name: 'Phiếu lương',
    url: '/nhan-su/phieu-luong',
    icon: 'cil-lock-locked'
  },
  {
    name: 'bản mẫu',
    url: '/nhan-su/phieu-luong/ban-mau',
    icon: 'cil-lock-locked'
  },
  {
    name: 'Ngày lễ',
    url: '/nhan-su/phieu-luong/ngay-le',
    icon: 'cil-lock-locked'
  },
  {
    title: true,
    name: 'Sơ đồ'
  },
  {
    name: 'Tổ chức',
    url: '/nhan-su/to-chuc',
    icon: 'cil-lock-locked'
  }
];
