import { MenuSellEnum } from '../enums';


export const menuSell = [
  {
    name: ' Bàn làm việc',
    icon: '../../assets/icon/sell-layout/house-door.svg',
    state:MenuSellEnum.HOME,
    href: '/'
  },
  {
    name: 'Khách hàng',
    icon: '../../assets/icon/sell-layout/building.svg',
    state:MenuSellEnum.CUSTOMER,
    href: '/khach-hang'
  },
  {
    name: 'Đơn hàng',
    icon: '../../assets/icon/sell-layout/cart.svg',
    state:MenuSellEnum.ORDER,
    href:'/don-hang'
  },
  {
    name: 'Tuyến đường',
    icon: '../../assets/icon/sell-layout/car.svg',
    state:MenuSellEnum.ROUTE,
    href:'/tuyen-duong'
  },
  {
    name: 'Lịch sử hệ thống',
    icon: '../../assets/icon/sell-layout/card-list.svg',
    state:MenuSellEnum.SYSTEM_HISTORY,
    href:'/he-thong/lich-su-he-thong'
  },
]

