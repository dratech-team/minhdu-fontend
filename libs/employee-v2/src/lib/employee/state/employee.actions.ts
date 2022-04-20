import {Salary} from '@minhdu-fontend/data-models';
import {createAction, props} from '@datorama/akita-ng-effects';
import {
  AddEmployeeDto,
  LoadOneEmployeeDto,
  RemoveEmployeeDto,
  SearchEmployeeDto,
  UpdateEmployeeDto
} from "../dto/employee";
import {EmployeeEntity} from "../entities";
import {AddRelativeDto, RemoveRelativeDto, UpdateRelativeDto} from "../dto/relative";
import {AddDegreeDto, RemoveDegreeDto, UpdateDegreeDto} from "../dto/degree";


export const addOne = createAction(
  '[EMPLOYEE] Load One',
  props<AddEmployeeDto>()
);

export const addOneRelative = createAction(
  '[EMPLOYEE] Add One Relative',
  props<AddRelativeDto>()
);

export const addOneDegree = createAction(
  '[EMPLOYEE] Add One Degree',
  props<AddDegreeDto>()
);

export const loadAll = createAction(
  '[EMPLOYEE] Load All',
  props<SearchEmployeeDto>()
);

export const loadOne = createAction(
  '[EMPLOYEE] Load one',
  props<LoadOneEmployeeDto>()
);

export const update = createAction(
  '[EMPLOYEE] Update',
  props<UpdateEmployeeDto>()
);

export const updateRelative = createAction(
  '[EMPLOYEE] Update Relative',
  props<UpdateRelativeDto>()
);

export const updateDegree = createAction(
  '[EMPLOYEE] Update Degree',
  props<UpdateDegreeDto>()
);

export const updateHistorySalary = createAction(
  '[EMPLOYEE] Update History Salary',
  props<{ id: number, salary: Partial<Salary>, employeeId: EmployeeEntity['id'] }>()
)

export const remove = createAction(
  '[EMPLOYEE] Remove',
  props<RemoveEmployeeDto>()
);

export const removeRelative = createAction(
  '[EMPLOYEE] Remove Relative',
  props<RemoveRelativeDto>()
);

export const removeDegree = createAction(
  '[EMPLOYEE] Remove Degree',
  props<RemoveDegreeDto>()
);

export const leave = createAction(
  '[EMPLOYEE] Leave employee',
  props<{ id: number, body: any }>()
);

export const removeWorkHistory = createAction(
  '[EMPLOYEE] Remove Work History',
  props<{ id: number, employeeId: EmployeeEntity['id'] }>()
)

export const removeHistorySalary = createAction(
  '[EMPLOYEE] Remove History Salary ',
  props<{ id: number, employeeId: number }>()
);

export const removeContracts = createAction(
  '[EMPLOYEE] Remove Contracts  ',
  props<{ id: number, employeeId: number }>()
);

export const error = createAction(
  '[EMPLOYEE] Error',
  props<{ error: string }>()
)

export const EmployeeActions = {
  addOne,
  addOneRelative,
  addOneDegree,
  loadAll,
  loadOne,
  update,
  updateRelative,
  updateDegree,
  updateHistorySalary,
  remove,
  leave,
  removeRelative,
  removeDegree,
  removeHistorySalary,
  removeWorkHistory,
  removeContracts,
  error
};
