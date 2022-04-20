import { EmployeeStatusEnum } from '../../enums';

export const EmployeeStatusConstant = [
  {
    name: 'Nhân viên còn làm ',
    value: EmployeeStatusEnum.IS_ACTIVE
  },
  {
    name: 'Nhân viên đã nghỉ',
    value: EmployeeStatusEnum.NOT_ACTIVE
  },
  {
    name: 'Tất cả',
    value: EmployeeStatusEnum.ALL
  }
];
