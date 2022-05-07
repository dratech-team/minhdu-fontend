import { App } from '@minhdu-fontend/enums';

const link = 'http://192.168.1.14:';

export const AppMinhDuConstant = [
  {
    name: 'Bán hàng',
    app: App.SELL,
    link: link + '82',
    icon: 'assets/icon/admin-layout/sell.png',
  },
  {
    name: 'kho',
    app: App.WAREHOUSE,
    link: '',
    icon: 'assets/icon/admin-layout/modal-department.png',
  },
  {
    name: 'Nhân sự',
    app: App.HUMAN_RESOURCE,
    link: link + '81',
    icon: 'assets/icon/admin-layout/hr.png',
  },
  {
    name: 'admin',
    app: App.ADMIN,
    link: 'http://localhost:4003/#/admin',
    icon: 'assets/icon/admin-layout/admin.png',
  },
];
