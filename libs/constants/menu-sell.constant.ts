import { MenuEnum } from '../enums';
import { HrefEnum } from '../../apps/sell/src/app/enums/href.enum';

export const menuSell = [
  {
    name: ' Bàn làm việc',
    icon: '../../assets/icon/sell-layout/house-door.svg',
    state: MenuEnum.HOME,
    href: HrefEnum.DASHBOARD,
  },
  {
    name: 'Khách hàng',
    icon: '../../assets/icon/sell-layout/building.svg',
    state: MenuEnum.CUSTOMER,
    href: HrefEnum.CUSTOMER,
  },
  {
    name: 'Đơn hàng',
    icon: '../../assets/icon/sell-layout/cart.svg',
    state: MenuEnum.ORDER,
    href: HrefEnum.ORDER,
  },
  {
    name: 'Tuyến đường',
    icon: '../../assets/icon/sell-layout/car.svg',
    state: MenuEnum.ROUTE,
    href: HrefEnum.ROUTE,
  },
  {
    name: 'Quản lý dòng gà',
    icon: '../../assets/icon/sell-layout/card-list.svg',
    state: MenuEnum.COMMODITY_TEMPLATE,
    href: HrefEnum.COMMODITY_TEMPLATE,
  },
  {
    name: 'Lịch sử hệ thống',
    icon: '../../assets/icon/sell-layout/card-list.svg',
    state: MenuEnum.SYSTEM_HISTORY,
    href: HrefEnum.SYSTEM,
  },
];
