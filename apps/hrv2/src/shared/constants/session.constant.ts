import {PartialDayEnum} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {SessionEntity} from '../entities';

export const workingTime = {
  morning: {
    start: new Date(new Date().setHours(7, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0))
  },
  afternoon: {
    start: new Date(new Date().setHours(13, 30, 0)),
    end: new Date(new Date().setHours(17, 0, 0))
  },
  night: {
    start: new Date(new Date().setHours(17, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 0))
  }
};

export const SessionConstant: SessionEntity[] = [
  {
    name: 'Buổi sáng',
    detail: 'Ngày buổi sáng',
    value: PartialDayEnum.MORNING,
    unit: DatetimeUnitEnum.DAY,
    startTime: workingTime.morning.start,
    endTime: workingTime.morning.end,
    types: [SalaryTypeEnum.OVERTIME, SalaryTypeEnum.ABSENT]
  },
  {
    name: 'Buổi chiều',
    detail: 'Ngày buổi chiều',
    value: PartialDayEnum.AFTERNOON,
    unit: DatetimeUnitEnum.DAY,
    startTime: workingTime.afternoon.start,
    endTime: workingTime.afternoon.end,
    types: [SalaryTypeEnum.OVERTIME, SalaryTypeEnum.ABSENT]
  },
  {
    name: 'Buổi tối',
    detail: 'Ngày buổi chiều',
    value: PartialDayEnum.NIGHT,
    unit: DatetimeUnitEnum.DAY,
    startTime: workingTime.night.start,
    endTime: workingTime.night.end,
    types: [SalaryTypeEnum.OVERTIME]
  },
  {
    name: 'Nguyên ngày',
    detail: 'Ngày',
    value: PartialDayEnum.ALL_DAY,
    unit: DatetimeUnitEnum.DAY,
    startTime: workingTime.morning.start,
    endTime: workingTime.afternoon.end,
    types: [SalaryTypeEnum.OVERTIME, SalaryTypeEnum.ABSENT]
  },
  // {
  //   name: 'Tuỳ chọn',
  //   detail: 'Phút',
  //   value: PartialDayEnum.CUSTOM,
  //   unit: DatetimeUnitEnum.MINUTE,
  //   startTime: workingTime.morning.start,
  //   endTime: workingTime.afternoon.end
  // }
];


