import {App} from '../enums';
import {Localhost} from "../enums/localhost.enum";

export const appConstant = [
  {
    name: 'Bán hàng',
    value: App.SELL,
    localHost: Localhost.APP_SELL
  },
  {
    name: 'kho',
    value: App.WAREHOUSE,
    localHost: Localhost.APP_WAREHOUSE
  },
  {
    name: 'Nhân sự',
    value: App.HR,
    localHost: Localhost.APP_HR
  },
  {
    name: 'Chưa xác định',
    value: App.UNKNOWN,
    localHost: Localhost.UNKNOWN
  },
  {
    name: 'Tất cả',
    value: '',
    localHost: ''
  },
]
