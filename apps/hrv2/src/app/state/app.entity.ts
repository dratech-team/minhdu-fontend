export enum TabEnum {
  DASHBOARD = '',
  RANK = 'xep-hang',
  EMPLOYEE = 'nhan-vien',
  PAYROLL = 'phieu-luong',
  ORGCHART = 'to-chuc',
  SYSTEM = 'he-thong',
  SETTING = 'cai-dat'
}

export interface RouterEnitty {
  readonly title: string;
  readonly path: string;
}
