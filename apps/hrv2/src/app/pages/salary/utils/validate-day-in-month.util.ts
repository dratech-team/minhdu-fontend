import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { getLastDayInMonth } from '@minhdu-fontend/utils';

export const validateDayInMonth = (cur: Date, fistDateInMonth: Date) => {
  return !(
    differenceInCalendarDays(
      cur,
      moment(fistDateInMonth).add(-1, 'days').toDate()
    ) > 0 &&
    differenceInCalendarDays(
      cur,
      moment(getLastDayInMonth(fistDateInMonth))
        .endOf('month')
        .add(1, 'days')
        .toDate()
    ) < 0
  );
};
