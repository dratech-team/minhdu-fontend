import { App } from "@minhdu-fontend/enums";

export const AppMinhDuConstant = [
  {
    name: 'Bán hàng',
    app: App.SELL,
    port:'81',
    icon:'assets/icon/admin-layout/sell.png'
  },
  {
    name: 'kho',
    app:  App.WAREHOUSE,
    port:'',
    icon: 'assets/icon/admin-layout/warehouse.png'
  },
  {
    name: 'Nhân sự',
    app: App.HUMAN_RESOURCE,
    port:'80',
    icon: 'assets/icon/admin-layout/hr.png'
  },
  {
    name: 'admin',
    app: App.ADMIN,
    port:'',
    icon: 'assets/icon/admin-layout/admin.png'
  },
]
