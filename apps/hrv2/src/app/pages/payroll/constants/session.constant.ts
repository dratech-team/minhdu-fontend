import {PartialDayEnum} from '@minhdu-fontend/data-models';

export const workingTime = {
  morning: {
    start: new Date(new Date().setHours(7, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0)),
  },
  afternoon: {
    start: new Date(new Date().setHours(13, 30, 0)),
    end: new Date(new Date().setHours(17, 0, 0))
  }
}


export const SessionConstant = [
  {
    name: 'Buổi sáng',
    detail: 'Ngày buổi sáng',
    value: PartialDayEnum.MORNING,
    startTime: workingTime.morning.start,
    endTime: workingTime.morning.end
  },
  {
    name: 'Buổi chiều',
    detail: 'Ngày buổi chiều',
    value: PartialDayEnum.AFTERNOON,
    startTime: workingTime.afternoon.start,
    endTime: workingTime.afternoon.end
  },
  {
    name: 'Nguyên ngày',
    detail: 'Ngày',
    value: PartialDayEnum.ALL_DAY,
    startTime: workingTime.morning.start,
    endTime: workingTime.afternoon.end
  },
  {
    name: 'Tuỳ chọn',
    detail: 'Phút',
    value: PartialDayEnum.CUSTOM,
    startTime: workingTime.morning.start,
    endTime: workingTime.afternoon.end
  }
];


