import { EmployeeStatusEnum } from '../../enums/hr/employee-status.enum';

export const EmployeeStatusConstant = [
  {
    name: 'Nhân viên còn làm ',
    value: EmployeeStatusEnum.IS_AVTIVE
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
