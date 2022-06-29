import { PartialDayEnum } from '@minhdu-fontend/data-models';

export const SessionConstant = [
  {
    name: 'Buổi sáng',
    detail: 'Ngày buổi sáng',
    value: PartialDayEnum.MORNING,
    startTime: new Date(0, 0, 0, 7, 0),
    endTime: new Date(0, 0, 0, 11, 30),
  },
  {
    name: 'Buổi chiều',
    detail: 'Ngày buổi chiều',
    value: PartialDayEnum.AFTERNOON,
    startTime: new Date(0, 0, 0, 13, 30),
    endTime: new Date(0, 0, 0, 17, 0),
  },
  {
    name: 'Nguyên ngày',
    detail: 'Ngày',
    value: PartialDayEnum.ALL_DAY,
    startTime: new Date(0, 0, 0, 7, 0),
    endTime: new Date(0, 0, 0, 17, 0),
  },
  {
    name: 'Tuỳ chọn',
    detail: 'Phút',
    value: PartialDayEnum.CUSTOM,
    startTime: new Date(0, 0, 0, 7, 0),
    endTime: new Date(0, 0, 0, 17, 0),
  },
];

export const DisableTimeConstant = [
  0, 1, 2, 3, 4, 5, 6, 7, 17, 18, 19, 20, 21, 22, 23, 24,
];
