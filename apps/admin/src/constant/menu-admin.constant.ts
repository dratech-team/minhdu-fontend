import { App, MenuEnum } from '@minhdu-fontend/enums';

export const MenuAdminConstant = [
  {
    name: 'Tổng quan',
    state:MenuEnum.OVERVIEW,
    href: '/'
  },
  {
    name: 'Tổng quan bán hàng',
    state:MenuEnum.OVERVIEW_SELL,
    href: '/ban-hang'
  },
  {
    name: 'Tổng quan kho',
    state:MenuEnum.OVERVIEW_WAREHOUSE,
    href: 'kho'
  },
  {
    name: 'Tổng quan nhân sự',
    state:MenuEnum.OVERVIEW_PERSONNEL,
    href: 'nhan-su'
  },
  {
    name: 'Tài chính',
    state:MenuEnum.OVERVIEW_FINANCE,
    href: 'tai-chinh'
  },
];
