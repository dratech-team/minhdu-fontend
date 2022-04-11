import {MenuHrEnum} from "../enums";

interface MenuHrConstant {
  name: string,
  icon: string,
  state: MenuHrEnum,
  href: string,
  children?: {
    name: string,
    icon: string,
    href: string
  }[]
}

export const MenuHrConstant: MenuHrConstant[] = [
  {
    name: 'Tổng quan',
    icon: '/assets/icon/menu/clipboard2.svg',
    state: MenuHrEnum.DASHBOARD,
    href: ''
  },
  {
    name: 'Nhân viên',
    icon: '/assets/icon/menu/box.svg',
    state: MenuHrEnum.EMPLOYEE,
    href: 'san-pham'
  },
  {
    name: 'Phiếu lương',
    icon: '/assets/icon/menu/box.svg',
    state: MenuHrEnum.PAYROLL,
    href: 'ton-kho'
  },
  {
    name: 'Tổ chức',
    icon: '/assets/icon/menu/box.svg',
    state: MenuHrEnum.ORGCHART,
    href: 'phieu-xuat-nhap-kho'
  },
  {
    name: 'Xếp hạng',
    icon: '/assets/icon/menu/wallet2.svg',
    state: MenuHrEnum.RANK,
    href: 'quan-ly-thu-chi'
  },
  {
    name: 'Hệ thống',
    icon: '/assets/icon/menu/wallet2.svg',
    state: MenuHrEnum.SYSTEM,
    href: 'quan-ly-thu-chi'
  },
]

