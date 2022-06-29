import { ConfirmStatus } from '../enums';

export const ConfirmConstant = [
  {
    name: 'Đã xác nhận',
    value: ConfirmStatus.CONFIRM,
  },
  {
    name: 'Chưa xác nhận',
    value: ConfirmStatus.NOT_CONFIRM,
  },
  {
    name: 'Tất cả',
    value: ConfirmStatus.ALL,
  },
];
