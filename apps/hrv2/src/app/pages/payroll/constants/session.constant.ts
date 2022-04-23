import {PartialDayEnum} from '@minhdu-fontend/data-models';

export const workingTime = {
    startTimeMorning: new Date(new Date().setHours(7, 0, 0)),
    endTimeMorning: new Date(new Date().setHours(11, 30, 0)),
    startTimeAfternoon: new Date(new Date().setHours(13, 30, 0)),
    endTimeAfternoon: new Date(new Date().setHours(17, 0, 0))
}


export const SessionConstant = [
  {
    name: 'Buổi sáng',
    detail: 'Ngày buổi sáng',
    value: PartialDayEnum.MORNING,
    startTime: workingTime.startTimeMorning,
    endTime: workingTime.endTimeMorning
  },
  {
    name: 'Buổi chiều',
    detail: 'Ngày buổi chiều',
    value: PartialDayEnum.AFTERNOON,
    startTime: workingTime.startTimeAfternoon,
    endTime: workingTime.endTimeAfternoon
  },
  {
    name: 'Nguyên ngày',
    detail: 'Ngày',
    value: PartialDayEnum.ALL_DAY,
    startTime: workingTime.startTimeMorning,
    endTime: workingTime.endTimeAfternoon
  },
  {
    name: 'Tuỳ chọn',
    detail: 'Phút',
    value: PartialDayEnum.CUSTOM,
    startTime: workingTime.startTimeMorning,
    endTime: workingTime.endTimeAfternoon
  }
];


