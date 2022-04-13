import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {PriceTypeConstant} from "./price-type.constant";
import {PriceTypeEnum} from "../enums";

interface blockSalary {
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
  priceTypes?: {
    name: string,
    value: PriceTypeEnum
  }[],
  price?: {
    disabled?: boolean,
    show?: boolean
  }
}

export const BlockSalariesConstant: blockSalary[] = [
  {
    title: 'Lương cơ bản',
    type: SalaryTypeEnum.BASIC,
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
    priceTypes: PriceTypeConstant,
    constraintHoliday: {
      disabled: false,
      show: true
    },
    constraintOvertime: {
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
