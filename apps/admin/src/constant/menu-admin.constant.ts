import {MenuAdminEnum} from "../enums/menu-admin.enum";

export const MenuAdminConstant = [
  {
    name: 'Tổng quan',
    state:MenuAdminEnum.OVERVIEW,
    href: '/'
  },
  {
    name: 'Tổng quan bán hàng',
    state:MenuAdminEnum.OVERVIEW_SELL,
    href: '/ban-hang'
  },
  {
    name: 'Tổng quan kho',
    state:MenuAdminEnum.OVERVIEW_WAREHOUSE,
    href: 'kho'
  },
  {
    name: 'Tổng quan nhân sự',
    state:MenuAdminEnum.OVERVIEW_PERSONNEL,
    href: 'nhan-su'
  },
  {
    name: 'Tài chính',
    state:MenuAdminEnum.OVERVIEW_FINANCE,
    href: 'tai-chinh'
  },
];
