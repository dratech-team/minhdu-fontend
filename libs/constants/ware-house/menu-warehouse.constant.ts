import {MenuEnum} from "../../enums";


export const MenuWarehouseConstant = [
  {
    name: 'Tổng quan',
    icon: '/assets/icon/menu/clipboard2.svg',
    state:MenuEnum.DASHBOARD,
    href: '/'
  },
  {
    name: 'Hàng hoá',
    icon: '/assets/icon/menu/box.svg',
    state:MenuEnum.COMMODITY,
    href: '/hang-hoa'
  },
  {
    name: 'Xuất - nhập kho',
    icon: '/assets/icon/menu/chevron-contract.svg',
    state:MenuEnum.IMPORT_EXPORT,
    href:'/xuat-nhap-kho'
  },
  {
    name: 'Quản lý thu chi',
    icon: '/assets/icon/menu/wallet2.svg',
    state:MenuEnum.REVENUE,
    href:'/quan-ly-thu-chi'
  },
  {
    name: 'Lịch sử hệ thống',
    icon: '/assets/icon/menu/card-list.svg',
    state:MenuEnum.ACCOUNT_MANAGEMENT,
    href:'/he-thong/lich-su-he-thong'
  },
]

