import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tổng quan',
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
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    title: true,
    name: 'Lương bổng'
  },
  {
    name: 'Phiếu lương',
    url: '/phieu-luong',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    title: true,
    name: 'Thiết lập'
  },
  {
    name: 'Thiết lập lương',
    url: '/ban-mau',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    name: 'Tăng ca',
    url: '/ban-mau/tang-ca',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    name: 'Ngày lễ',
    url: '/ban-mau/ngay-le',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    title: true,
    name: 'Tổ chức'
  },
  {
    name: 'Đơn vị',
    url: '/to-chuc/don-vi',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    name: 'Chức vụ',
    url: '/to-chuc/chuc-vu',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    title: true,
    name: 'Hệ thống'
  },
  {
    name: 'Lịch sử hệ thống',
    url: '/he-thong',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    name: 'Quản lý tài khoản',
    url: '/he-thong/quan-ly-tai-khoan',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  },
  {
    title: true,
    name: 'Xếp hạng'
  },
  {
    name: 'Xếp hạng cuối năm',
    url: '/xep-hang',
    icon: 'cil-lock-locked',
    linkProps:{
      queryParams:{mode: localStorage.getItem('mode')}
    }
  }
];
