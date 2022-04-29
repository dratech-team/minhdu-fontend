import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export const SalariesConstant = [
  {
    name: 'Tăng ca',
    value: SalaryTypeEnum.OVERTIME
  },
  {
    name: 'Vắng',
    value: SalaryTypeEnum.ABSENT
  },
  {
    name: 'Cơ bản',
    value: SalaryTypeEnum.BASIC
  },
  {
    name: 'Phụ cấp',
    value: SalaryTypeEnum.STAY
  },
  {
    name: 'Phụ cấp khác',
    value: SalaryTypeEnum.ALLOWANCE
  },
  {
    name: 'Khấu trừ',
    value: SalaryTypeEnum.DEDUCTION
  },
]
