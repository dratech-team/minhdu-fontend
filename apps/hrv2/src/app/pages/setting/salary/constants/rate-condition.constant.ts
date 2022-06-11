import {RateConditionEnum} from "../enums/rate-condition.enum";

export const RateConditionConstant = [
  {
    name: 'Theo ngày vắng',
    value: RateConditionEnum.ABSENT,
  },
  {
    name: 'Theo ngày công chuẩn',
    value: RateConditionEnum.WORKDAY,
  },
]
