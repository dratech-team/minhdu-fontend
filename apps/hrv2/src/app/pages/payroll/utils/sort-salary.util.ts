import { FilterSalaryEnum } from '../enums/filter-salary.enum';
import { NzTableSortOrder } from 'ng-zorro-antd/table';
import { SalaryEntity } from '../../salary/entities';
import { CompareSortUtil } from './compare-sort.util';

export const SortSalaryUtil = (
  column: FilterSalaryEnum,
  type: NzTableSortOrder,
  salaries: SalaryEntity[]
) => {
  return salaries.sort((a, b) => {
    const isAsc = type === 'descend';
    switch (column) {
      case FilterSalaryEnum.TITLE:
        return CompareSortUtil(a.title, b.title, isAsc);
      case FilterSalaryEnum.DATETIME:
        return CompareSortUtil(a.startedAt, b.startedAt, isAsc);
      case FilterSalaryEnum.DURATION:
        return CompareSortUtil(a.duration, b.duration, isAsc);
      case FilterSalaryEnum.TYPE:
        return CompareSortUtil(a.type, b.type, isAsc);
      case FilterSalaryEnum.TITLE_SETTING:
        return CompareSortUtil(a.setting.title, b.setting.title, isAsc);
      case FilterSalaryEnum.DATETIME_SETTING:
        return CompareSortUtil(a.setting.startedAt, b.setting.startedAt, isAsc);
      case FilterSalaryEnum.RATE_SETTING:
        return CompareSortUtil(a.setting.rate, b.setting.rate, isAsc);
      case FilterSalaryEnum.TITLE_SETTING_PARTIAL:
        return CompareSortUtil(
          a.setting.title + a.partial,
          b.setting.title + b.partial,
          isAsc
        );
    }
  });
};
