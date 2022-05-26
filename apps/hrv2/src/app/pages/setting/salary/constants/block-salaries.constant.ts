import {PriceType, SalaryTypeEnum} from "../enums";
import {recipesConstant, recipesConstantOvertime} from "./recipes.constant";
import {DatetimeUnitEnum, EmployeeType} from "@minhdu-fontend/enums";
import {UnitDatetimeConstant} from "./unit-datetime.constant";
import {EmployeeTypeConstant} from "./employee-type.constant";
import {ReferenceOvertimeConstant} from "./reference-overtime.constant";
import {NzDateMode} from "ng-zorro-antd/date-picker";

interface BlockSalary {
  title: string,
  type: SalaryTypeEnum,
  rate?: {
    disabled?: boolean,
    show?: boolean
  }
  unit?: {
    units: {
      name: string,
      value: DatetimeUnitEnum,
    }[],
    disabled?: boolean
  },
  datetime?: {
    type: NzDateMode
    disabled?: boolean,
    show?: boolean
  },
  rangeDay?: {
    type: NzDateMode
    disabled?: boolean,
    show?: boolean
  },
  constraintHoliday?: {
    disabled?: boolean,
    show?: boolean
  },
  constraintOvertime?: {
    disabled?: boolean,
    show?: boolean
  }
  recipesConstant?: {
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
  branch?: {
    disabled?: boolean,
    show: boolean
  },
  position?: {
    disabled?: boolean,
    show: boolean
  },
  hasConstraints?: {
    disabled?: boolean,
    show: boolean
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
    title: 'Loại vắng',
    type: SalaryTypeEnum.ABSENT,
    recipesConstant: recipesConstant,
    constraintHoliday: {
      disabled: false,
      show: true
    },
    constraintOvertime: {
      disabled: false,
      show: true
    },
    unit: {
      units: UnitDatetimeConstant.filter(item => item.salaryType.includes(SalaryTypeEnum.ABSENT)),
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
    title: 'Tăng ca',
    type: SalaryTypeEnum.OVERTIME,
    employeeConstant: EmployeeTypeConstant,
    unit: {
      units: UnitDatetimeConstant.filter(item => item.salaryType.includes(SalaryTypeEnum.OVERTIME)),
    },
    recipesConstant: recipesConstantOvertime,
    rate: {
      disabled: false,
      show: true
    },
    price: {
      disabled: false,
      show: true
    },
    branch: {
      disabled: false,
      show: true,
    },
    position: {
      disabled: false,
      show: true,
    },
    hasConstraints: {
      disabled: false,
      show: true
    }
  },
  {
    title: 'Ngày lễ',
    type: SalaryTypeEnum.HOLIDAY,
    recipesConstant: recipesConstant,
    unit: {
      units: UnitDatetimeConstant.filter(item => item.salaryType.includes(SalaryTypeEnum.HOLIDAY)),
      disabled: true
    },
    rangeDay: {
      type: 'date',
      disabled: false,
      show: true
    },
    rate: {
      disabled: false,
      show: true
    },
    price: {
      disabled: false,
      show: true
    },
    branch: {
      disabled: false,
      show: true,
    },
    position: {
      disabled: false,
      show: true,
    },
  },
];
