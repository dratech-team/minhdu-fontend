import {PriceType, SalaryTypeEnum} from "../enums";
import {referencesConstant} from "./reference.constant";
import {DatetimeUnitEnum, EmployeeType} from "@minhdu-fontend/enums";
import {UnitDatetimeConstant} from "./unit-datetime.constant";
import {EmployeeTypeConstant} from "./employee-type.constant";
import {ReferenceOvertimeConstant} from "./reference-overtime.constant";

interface BlockSalary {
  title: string,
  type: SalaryTypeEnum,
  rate?: {
    disabled?: boolean,
    show?: boolean
  }
  units?: {
    name: string,
    value: DatetimeUnitEnum,
    salaryType: SalaryTypeEnum[]
  }[],
  constraintHoliday?: {
    disabled?: boolean,
    show?: boolean
  },
  constraintOvertime?: {
    disabled?: boolean,
    show?: boolean
  }
  referenceConstant?: {
    name: string,
    value: PriceType
  }[],
  employeeConstant?: {
    name: string,
    value: EmployeeType
  }[],
  price?: {
    disabled?: boolean,
    show?: boolean
  }
  insurance?: {
    disabled?: boolean,
    show?: boolean
  }
}

export const blockSalariesConstant: BlockSalary[] = [
  {
    title: 'Lương cơ bản',
    type: SalaryTypeEnum.BASIC,
    constraintHoliday: {
      disabled: false,
      show: false
    },
    insurance: {
      show: true,
      disabled: false
    },
    rate: {
      disabled: false,
      show: true
    },
    price: {
      disabled: false,
      show: true
    }
  },
  {
    title: 'Phụ cấp lương',
    type: SalaryTypeEnum.STAY,
    constraintHoliday: {
      disabled: false,
      show: false
    },
    rate: {
      disabled: false,
      show: true
    },
    price: {
      disabled: false,
      show: true
    }
  },
  {
    title: 'Khấu trừ',
    type: SalaryTypeEnum.ABSENT,
    referenceConstant: referencesConstant,
    constraintHoliday: {
      disabled: false,
      show: false
    },
    constraintOvertime: {
      disabled: false,
      show: false
    },
    units: UnitDatetimeConstant.filter(item => item.salaryType.includes(SalaryTypeEnum.ABSENT)),
    rate: {
      disabled: false,
      show: true
    },
    price: {
      disabled: false,
      show: true
    }
  },
  {
    title: 'Tăng ca',
    type: SalaryTypeEnum.OVERTIME,
    employeeConstant:EmployeeTypeConstant,
    units: UnitDatetimeConstant.filter(item => item.salaryType.includes(SalaryTypeEnum.OVERTIME)),
    referenceConstant: referencesConstant,
    rate: {
      disabled: false,
      show: true
    },
    price: {
      disabled: false,
      show: true
    }
  },
  {
    title: 'Ngày lễ',
    type: SalaryTypeEnum.HOLIDAY,
    rate: {
      disabled: false,
      show: true
    },
    price: {
      disabled: false,
      show: true
    }
  },
];
