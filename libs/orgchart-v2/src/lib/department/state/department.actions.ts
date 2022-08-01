import { createAction, props } from '@datorama/akita-ng-effects';
import {
  AddDepartmentDto,
  LoadOneDepartmentDto,
  RemoveDepartmentDto,
  SearchDepartmentDto,
  UpdateDepartmentDto
} from '../dto';
import { DepartmentEntity } from '../entities/department.entity';

const addOne = createAction('[Department] Add One', props<AddDepartmentDto>());

const loadAll = createAction(
  '[Department] Load All',
  props<Partial<SearchDepartmentDto>>()
);

const loadOne = createAction(
  '[Department] Load One',
  props<LoadOneDepartmentDto>()
);

const update = createAction(
  '[Department] Update',
  props<UpdateDepartmentDto>()
);

const remove = createAction(
  '[Department] Remove',
  props<RemoveDepartmentDto>()
);

const error = createAction('[Department] Error', props<{ error: string }>());

const removeEmployee = createAction(
  '[Department] Delete Allowance',
  props<{
    id: DepartmentEntity['id'];
    body: { employeeId: number };
  }>()
);

export const DepartmentActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
  removeEmployee
};
