import {MenuHrEnum} from "../enums";
import {TabEnum} from "../../app/state/app.entity";

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
    href: TabEnum.DASHBOARD
  },
  {
    name: 'Nhân viên',
    icon: '/assets/icons/menu/person.svg',
    state: MenuHrEnum.EMPLOYEE,
    href: TabEnum.EMPLOYEE
  },
  {
    name: 'Phiếu lương',
    icon: '/assets/icons/menu/clipboard-data.svg',
    state: MenuHrEnum.PAYROLL,
    href: TabEnum.PAYROLL,
  },
  {
    name: 'Cài đặt',
    icon: '/assets/icons/menu/templates.png',
    state: MenuHrEnum.SETTING,
    href: TabEnum.SETTING,
    children: [
      {
        name: 'Lương',
        href: 'cai-dat/luong'
      },
      {
        name: 'Ngày lễ',
        href: 'cai-dat/ngay-le'
      }
    ]
  },
  {
    name: 'Tổ chức',
    icon: '/assets/icons/menu/diagram-3-fill.svg',
    state: MenuHrEnum.ORGCHART,
    href: TabEnum.ORGCHART,
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
    href: TabEnum.RANK
  },
  {
    name: 'Hệ thống',
    icon: '/assets/icons/menu/gear-wide.svg',
    state: MenuHrEnum.SYSTEM,
    href: TabEnum.SYSTEM,
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

