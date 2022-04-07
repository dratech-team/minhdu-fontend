import {MenuWarehouseEum} from "@minhdu-fontend/enums";

interface menuWarehouse {
  name: string,
  icon: string,
  state: MenuWarehouseEum,
  href: string,
  children?: {
    name: string,
    icon: string,
    href: string
  }[]
}

export const MenuWarehouseConstant: menuWarehouse[] = [
  {
    name: 'Tổng quan',
    icon: '/assets/icon/menu/clipboard2.svg',
    state: MenuWarehouseEum.DASHBOARD,
    href: ''
  },
  {
    name: 'Sản phẩm',
    icon: '/assets/icon/menu/box.svg',
    state: MenuWarehouseEum.PRODUCT,
    href: 'san-pham'
  },
  {
    name: 'Phiếu xuất nhập kho',
    icon: '/assets/icon/menu/box.svg',
    state: MenuWarehouseEum.STOCK,
    href: 'phieu-xuat-nhap-kho'
  },
  {
    name: 'Quản lý thu chi',
    icon: '/assets/icon/menu/wallet2.svg',
    state: MenuWarehouseEum.REVENUE,
    href: 'quan-ly-thu-chi'
  },
  {
    name: 'Lịch sử hệ thống',
    icon: '/assets/icon/menu/card-list.svg',
    state: MenuWarehouseEum.ACCOUNT_MANAGEMENT,
    href: 'he-thong/lich-su-he-thong'
  },
]

