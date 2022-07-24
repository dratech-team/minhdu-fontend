import { NzTableSortOrder } from 'ng-zorro-antd/table';

export interface Sort {
  orderBy: string;
  orderType: NzTableSortOrder;
}

export interface SortEntity {
  key: string;
  directions: NzTableSortOrder;
}
