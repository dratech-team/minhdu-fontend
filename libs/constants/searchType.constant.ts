import { SearchTypeEnum } from '../enums';

export const SearchTypeConstant = [
  {
    name: 'Chứa',
    value: SearchTypeEnum.CONTAINS
  },
  {
    name: 'Trùng khớp',
    value: SearchTypeEnum.EQUALS
  },
  {
    name: 'Bắt đầu với',
    value: SearchTypeEnum.START_WITH
  },
];
