import { MenuEnum } from '../enums';


export const menuSell = [
  {
    name: ' Bàn làm việc',
    icon: '../../assets/icon/sell-layout/house-door.svg',
    state:MenuEnum.HOME,
    href: '/'
  },
  {
    name: 'Khách hàng',
    icon: '../../assets/icon/sell-layout/building.svg',
    state:MenuEnum.CUSTOMER,
    href: '/khach-hang'
  },
  {
    name: 'Đơn hàng',
    icon: '../../assets/icon/sell-layout/cart.svg',
    state:MenuEnum.ORDER,
    href:'/don-hang'
  },
  {
    name: 'Tuyến đường',
    icon: '../../assets/icon/sell-layout/car.svg',
    state:MenuEnum.ROUTE,
    href:'/tuyen-duong'
  },
  {
    name: 'Lịch sử hệ thống',
    icon: '../../assets/icon/sell-layout/card-list.svg',
    state:MenuEnum.SYSTEM_HISTORY,
    href:'/he-thong/lich-su-he-thong'
  },
]

