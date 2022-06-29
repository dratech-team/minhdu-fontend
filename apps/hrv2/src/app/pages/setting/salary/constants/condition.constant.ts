import { ConditionEnum } from '../enums/condition.enum';

export const ConditionConstant = [
  {
    name: 'Nhỏ hơn',
    value: ConditionEnum.LESS,
  },
  {
    name: 'Nhỏ hơn hoặc bằng',
    value: ConditionEnum.LESS_EQUAL,
  },
  {
    name: 'Lớn hơn',
    value: ConditionEnum.GREATER,
  },
  {
    name: 'Lớn hơn hoặc bằng',
    value: ConditionEnum.GREATER_EQUAL,
  },
  {
    name: 'Bằng',
    value: ConditionEnum.EQUAL,
  },
  {
    name: 'Không bằng',
    value: ConditionEnum.NOT_EQUAL,
  },
];
