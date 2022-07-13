import { getDateInPreviousMonth, getFirstDayInMonth } from '../utils';
import * as moment from 'moment';

export interface TitleDatePicker {
  title: string;
  children: Children[];
}

interface Children {
  title: string;
  startedAt: Date | null;
  endedAt: Date | null;
}

export const titleDatepicker: TitleDatePicker[] = [
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
        endedAt: moment().endOf('week').toDate()
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
        endedAt: moment(new Date()).endOf('months').toDate()
      },
      {
        title: 'Tháng trước',
        startedAt: getDateInPreviousMonth().fistDate,
        endedAt: getDateInPreviousMonth().lastDate
      },
      {
        title: '30 ngày qua',
        startedAt: moment().subtract(30, 'days').toDate(),
        endedAt: new Date()
      },
      {
        title: 'Quí này',
        startedAt: moment(new Date()).startOf('quarter').toDate(),
        endedAt: moment(new Date()).endOf('quarter').toDate()
      },
      {
        title: 'Quí trước',
        startedAt: moment(new Date()).subtract(1, 'quarters').startOf('quarters').toDate(),
        endedAt: moment(new Date()).subtract(1, 'quarters').endOf('quarters').toDate()
      }
    ]
  }
];
