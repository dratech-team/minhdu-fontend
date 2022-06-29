import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { BaseSearchDepartmenthDto } from '../dto';
import { DepartmentEntity } from '../entities/department.entity';
import { StorageName } from '@minhdu-fontend/constants';

export interface DepartmentState extends EntityState<DepartmentEntity> {
  loading?: boolean;
  total: number;
  search: Partial<BaseSearchDepartmenthDto>;
}

function createInitState(): DepartmentState {
  return {
    total: 0,
    search: {
      name: '',
      code: '',
    },
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.DEPARTMENT })
export class DepartmentStore extends EntityStore<DepartmentState> {
  constructor() {
    super(createInitState());
  }
}
