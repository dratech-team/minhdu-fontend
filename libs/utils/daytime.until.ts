import * as moment from 'moment';

export const getDaysInMonth = (datetime: Date) => {
  const month = new Date(datetime).getMonth() + 1;
  const year = new Date(datetime).getFullYear();
  return new Date(year, month, 0).getDate();
};

export const getFirstDayInMonth = (datetime: Date) => {
  return new Date(datetime.getFullYear(), datetime.getMonth(), 1);
};

export const getLastDayInMonth = (datetime: Date) => {
  return new Date(datetime.getFullYear(), datetime.getMonth() + 1, 0);
};

export function isEqualDatetime(
  datetime1: Date,
  datetime2: Date,
  type?: 'month' | 'year'
): boolean {
  return moment(datetime1).isSame(datetime2, type);
}

export const rageDaysInMonth = (datetime: Date) => {
  const range = [];
  const fromDate = moment(getFirstDayInMonth(datetime));
  const toDate = moment(getLastDayInMonth(datetime));
  const diff = toDate.diff(fromDate, 'days') + 1;
  for (let i = 0; i < diff; i++) {
    range.push({
      title: moment(getFirstDayInMonth(datetime)).add(i, 'days'),
      key: moment(getFirstDayInMonth(datetime)).add(i, 'days').format('DD-MM')
    });
  }
  return range;
};

export const sortDatetime = (array: any[]) => {
  if (array.every(e => e.datetime)) {
    return array.sort(function (a, b) {
      return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
    });
  } else {
    return array;
  }
};

export const getYesterday = () => {
  const timeStamp = new Date().getTime();
  const yesterdayTimeStamp = timeStamp - 24 * 60 * 60 * 1000;
  return new Date(yesterdayTimeStamp);
}


export const getDayInPreviousMonth = () => {
  const fistDay = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  const lastDay = getLastDayInMonth(fistDay)
  return {
    fistDay,
    lastDay
  }
}

export const getDateIn30Day = () => {
  const curr = new Date;
  const last = curr.getDate() - 30;

  return {
    firstDay: curr,
    lastDay: new Date(curr.setDate(last)).toUTCString()
  }
}
