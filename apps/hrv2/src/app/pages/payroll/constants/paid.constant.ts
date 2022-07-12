import { PaidStatus } from '../enums';

export const PaidConstant = [
  {
    name: 'Đã Thanh toán',
    value: PaidStatus.PAID,
  },
  {
    name: 'Chưa thanh toán',
    value: PaidStatus.NOT_PAID,
  },
  {
    name: 'Tất cả',
    value: PaidStatus.ALL,
  },
];
