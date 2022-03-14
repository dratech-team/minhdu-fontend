import { getDayInPreviousMonth, getFirstDayInMonth } from '../utils';
import * as moment from 'moment';

export interface OptionDataPicker {
  title: string,
  children: children []
}

interface children {
  title: string,
  startedAt: Date,
  endedAt: Date
}

export const OptionDataPickerConstant: OptionDataPicker[] = [
  {
    title: 'Theo ngày và tuần',
    children: [
      {
        title: 'Hôm nay',
        startedAt: new Date(),
        endedAt: new Date()
      },
      {
        title: 'Hôm qua',
        startedAt: moment().subtract(1, 'days').toDate(),
        endedAt: moment().subtract(1, 'days').toDate()
      },
      {
        title: 'Tuần này',
        startedAt: moment().startOf('week').toDate(),
        endedAt: new Date()
      },
      {
        title: '7 ngày qua',
        startedAt: moment().subtract(7, 'days').toDate(),
        endedAt: new Date()
      }
    ]
  },
  {
    title: 'Theo tháng và quý',
    children: [
      {
        title: 'Tháng này',
        startedAt: getFirstDayInMonth(new Date()),
        endedAt: new Date()
      },
      {
        title: 'Tháng trước',
        startedAt: getDayInPreviousMonth().fistDay,
        endedAt: getDayInPreviousMonth().lastDay
      },
      {
        title: '30 ngày qua',
        startedAt: moment().add(-30, 'days').toDate(),
        endedAt: new Date()
      },
      {
        title: 'quí này',
        startedAt: moment().startOf('quarter').toDate(),
        endedAt: new Date()
      },
      {
        title: 'quí trước',
        startedAt: moment().startOf('quarter').toDate(),
        endedAt: new Date()
      }
    ]
  }
];
