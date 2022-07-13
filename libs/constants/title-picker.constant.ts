import { getDateInPreviousMonth, getFirstDayInMonth } from '../utils';
import * as moment from 'moment';

export interface TitleDatePicker {
  title: string;
  children: Children[];
}

interface Children {
  title: string;
  start: Date;
  end: Date;
}

export const titleDatepicker: TitleDatePicker[] = [
  {
    title: 'Theo ngày và tuần',
    children: [
      {
        title: 'Hôm nay',
        start: new Date(),
        end: new Date()
      },
      {
        title: 'Hôm qua',
        start: moment().subtract(1, 'days').toDate(),
        end: moment().subtract(1, 'days').toDate()
      },
      {
        title: 'Tuần này',
        start: moment().startOf('week').toDate(),
        end: moment().endOf('week').toDate()
      },
      {
        title: '7 ngày qua',
        start: moment().subtract(7, 'days').toDate(),
        end: new Date()
      }
    ]
  },
  {
    title: 'Theo tháng và quý',
    children: [
      {
        title: 'Tháng này',
        start: getFirstDayInMonth(new Date()),
        end: moment(new Date()).endOf('months').toDate()
      },
      {
        title: 'Tháng trước',
        start: getDateInPreviousMonth().fistDate,
        end: getDateInPreviousMonth().lastDate
      },
      {
        title: '30 ngày qua',
        start: moment().subtract(30, 'days').toDate(),
        end: new Date()
      },
      {
        title: 'Quí này',
        start: moment(new Date()).startOf('quarter').toDate(),
        end: moment(new Date()).endOf('quarter').toDate()
      },
      {
        title: 'Quí trước',
        start: moment(new Date()).subtract(1, 'quarters').startOf('quarters').toDate(),
        end: moment(new Date()).subtract(1, 'quarters').endOf('quarters').toDate()
      }
    ]
  }
];
