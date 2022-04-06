import { App, MenuWarehouseEum } from '@minhdu-fontend/enums';

export const MenuAdminConstant = [
  {
    name: 'Tổng quan',
    state:MenuWarehouseEum.OVERVIEW,
    href: '/'
  },
  {
    name: 'Tổng quan bán hàng',
    state:MenuWarehouseEum.OVERVIEW_SELL,
    href: '/ban-hang'
  },
  {
    name: 'Tổng quan kho',
    state:MenuWarehouseEum.OVERVIEW_WAREHOUSE,
    href: 'kho'
  },
  {
    name: 'Tổng quan nhân sự',
    state:MenuWarehouseEum.OVERVIEW_PERSONNEL,
    href: 'nhan-su'
  },
  {
    name: 'Tài chính',
    state:MenuWarehouseEum.OVERVIEW_FINANCE,
    href: 'tai-chinh'
  },
];
