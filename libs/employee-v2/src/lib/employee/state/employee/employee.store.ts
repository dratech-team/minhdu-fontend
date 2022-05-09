import {EntityState, EntityStore, StoreConfig} from "@datorama/akita";
import {EmployeeEntity} from "../../entities";
import {Injectable} from "@angular/core";
import {EmployeeStatusEnum, EmployeeType, Gender} from "@minhdu-fontend/enums";
import {SearchEmployeeStateEntity} from "../../entities/search-employee-state.entity";
import { FlatSalaryTypeEnum } from '../../../../../../../apps/hrv2/src/app/pages/employee/enums/flat-salary-type.enum';

export interface EmployeeState extends EntityState<EmployeeEntity> {
  readonly total: number
  readonly loading: boolean,
  readonly added: boolean | null,
  readonly search: Partial<SearchEmployeeStateEntity>
}

export function createInitialState(): EmployeeState {
  return {
    total: 0,
    loading: true,
    added: null,
    search: {
      name: '',
      phone: '',
      identify:'',
      address:'',
      status: EmployeeStatusEnum.IS_ACTIVE,
      gender: Gender.ALL,
      flatSalary: FlatSalaryTypeEnum.ALL,
      employeeType: EmployeeType.EMPLOYEE_FULL_TIME,
    }
  }
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'employee'})
export class EmployeeStore extends EntityStore<EmployeeState> {
  constructor() {
    super(createInitialState());
  }
}