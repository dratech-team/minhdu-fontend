import {MenuHrEnum} from "../enums";

interface MenuHrConstant {
  name: string,
  icon: string,
  state: MenuHrEnum,
  href: string,
  children?: {
    name: string,
    icon?: string,
    href: string
  }[]
}

export const MenuHrConstant: MenuHrConstant[] = [
  {
    name: 'Tổng quan',
    icon: '/assets/icons/menu/clipboard2 (1).svg',
    state: MenuHrEnum.DASHBOARD,
    href: ''
  },
  {
    name: 'Nhân viên',
    icon: '/assets/icons/menu/person.svg',
    state: MenuHrEnum.EMPLOYEE,
    href: 'nhan-vien'
  },
  {
    name: 'Phiếu lương',
    icon: '/assets/icons/menu/clipboard-data.svg',
    state: MenuHrEnum.PAYROLL,
    href: 'phieu-luong',
  },
  {
    name: 'Bảng mẫu',
    icon: '/assets/icons/menu/diagram-3-fill.svg',
    state: MenuHrEnum.TEMPLATE,
    href: 'bang-mau',
    children: [
      {
        name: 'Lương',
        href: 'bang-mau/luong'
      },
      {
        name: 'Tăng ca',
        href: 'bang-mau/tang-ca'
      },
      {
        name: 'Ngày lễ',
        href: 'bang-mau/ngay-le'
      }
    ]
  },
  {
    name: 'Tổ chức',
    icon: '/assets/icons/menu/diagram-3-fill.svg',
    state: MenuHrEnum.ORGCHART,
    href: 'to-chuc',
    children: [
      {
        name: 'Đơn vị',
        href: 'to-chuc/don-vi'
      },
      {
        name: 'Chức vụ',
        href: 'to-chuc/chuc-vu'
      }
    ]
  },
  {
    name: 'Xếp hạng',
    icon: '/assets/icons/menu/bar-chart-steps.svg',
    state: MenuHrEnum.RANK,
    href: 'xep-hang'
  },
  {
    name: 'Hệ thống',
    icon: '/assets/icons/menu/gear-wide.svg',
    state: MenuHrEnum.SYSTEM,
    href: 'he-thong',
    children: [
      {
        name: 'Lịch sử hệ thống',
        href: 'to-chuc/lich-su-he-thong'
      },
      {
        name: 'Quản lý tài khản',
        href: 'to-chuc/quan-ly-tai-khoan'
      }
    ]
  },
]

