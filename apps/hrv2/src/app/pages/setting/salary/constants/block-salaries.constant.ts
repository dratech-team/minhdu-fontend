import {salaryReference, SalaryTypeEnum} from "../enums";
import {referencesTypeConstant} from "./reference-type.constant";

interface BlockSalary {
  title: string,
  type: SalaryTypeEnum,
  rate?: {
    disabled?: boolean,
    show?: boolean
  }
  constraintHoliday?: {
    disabled?: boolean,
    show?: boolean
  },
  constraintOvertime?: {
    disabled?: boolean,
    show?: boolean
  }
  references?: {
    name: string,
    value: salaryReference
  }[],
  price?: {
    disabled?: boolean,
    show?: boolean
  }
  insurance? :{
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
    insurance:{
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
    references: referencesTypeConstant,
    constraintHoliday: {
      disabled: false,
      show: false
    },
    constraintOvertime: {
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
    title: 'Tăng ca',
    type: SalaryTypeEnum.OVERTIME,
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
