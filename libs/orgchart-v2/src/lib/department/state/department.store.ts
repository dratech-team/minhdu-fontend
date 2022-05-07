import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {BaseSearchDepartmenthDto} from "../dto";
import {StorageName} from "../../constants";
import {DepartmentEntity} from "../entities/department.entity";

export interface DepartmentState extends EntityState<DepartmentEntity> {
  loading: boolean;
  added: boolean | null;
  total: number
  search: Partial<BaseSearchDepartmenthDto>;
  removeEmp: boolean | null
}

function createInitState(): DepartmentState {
  return {
    loading: true,
    added: null,
    total: 0,
    search: {
      name: '',
      code: ''
    },
    removeEmp: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.DEPARTMENT})
export class DepartmentStore extends EntityStore<DepartmentState> {
  constructor() {
    super(createInitState());
  }
}
