import {MenuEnum} from "@minhdu-fontend/enums";
import {sr_RS} from "ng-zorro-antd/i18n";

interface menuWarehouse {
  name: string,
  icon: string,
  state: MenuEnum,
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
    state: MenuEnum.DASHBOARD,
    href: ''
  },
  {
    name: 'Phiếu xuất nhập kho',
    icon: '/assets/icon/menu/box.svg',
    state: MenuEnum.COMMODITY,
    href: 'phieu-xuat-nhap-kho'
  },
  {
    name: 'Xuất - nhập kho',
    icon: '/assets/icon/menu/chevron-contract.svg',
    state: MenuEnum.IMPORT_EXPORT,
    href: 'xuat-nhap-kho',
    children: [
      {
        name: 'Nhập hàng',
        icon: '',
        href:'xuat-nhap-kho'
      },
      {
        name: 'Xuất hàng',
        icon: '',
        href: 'xuat-nhap-kho/xuat-kho'
      },
      {
        name: 'Kiểm hàng',
        icon: '',
        href:'xuat-nhap-kho/kiem-hang'
      },
    ]
  },
  {
    name: 'Quản lý thu chi',
    icon: '/assets/icon/menu/wallet2.svg',
    state: MenuEnum.REVENUE,
    href: 'quan-ly-thu-chi'
  },
  {
    name: 'Lịch sử hệ thống',
    icon: '/assets/icon/menu/card-list.svg',
    state: MenuEnum.ACCOUNT_MANAGEMENT,
    href: 'he-thong/lich-su-he-thong'
  },
]

