import {Salary} from '@minhdu-fontend/data-models';
import {createAction, props} from '@datorama/akita-ng-effects';
import {
  AddEmployeeDto,
  LoadOneEmployeeDto,
  RemoveEmployeeDto,
  SearchEmployeeDto,
  UpdateEmployeeDto
} from "../../dto/employee";
import {EmployeeEntity} from "../../entities";
import {AddRelativeDto, RemoveRelativeDto, UpdateRelativeDto} from "../../dto/relative";
import {AddDegreeDto, RemoveDegreeDto, UpdateDegreeDto} from "../../dto/degree";

const addOne = createAction(
  '[EMPLOYEE] Load One',
  props<AddEmployeeDto>()
);

const addOneRelative = createAction(
  '[EMPLOYEE] Add One Relative',
  props<AddRelativeDto>()
);

const addOneDegree = createAction(
  '[EMPLOYEE] Add One Degree',
  props<AddDegreeDto>()
);

const loadAll = createAction(
  '[EMPLOYEE] Load All',
  props<SearchEmployeeDto>()
);

const loadOne = createAction(
  '[EMPLOYEE] Load one',
  props<LoadOneEmployeeDto>()
);

const update = createAction(
  '[EMPLOYEE] Update',
  props<UpdateEmployeeDto>()
);

const updateRelative = createAction(
  '[EMPLOYEE] Update Relative',
  props<UpdateRelativeDto>()
);

const updateDegree = createAction(
  '[EMPLOYEE] Update Degree',
  props<UpdateDegreeDto>()
);

const updateHistorySalary = createAction(
  '[EMPLOYEE] Update History Salary',
  props<{ id: number, salary: Partial<Salary>, employeeId: EmployeeEntity['id'] }>()
)

const remove = createAction(
  '[EMPLOYEE] Remove',
  props<RemoveEmployeeDto>()
);

const removeRelative = createAction(
  '[EMPLOYEE] Remove Relative',
  props<RemoveRelativeDto>()
);

const removeDegree = createAction(
  '[EMPLOYEE] Remove Degree',
  props<RemoveDegreeDto>()
);

const leave = createAction(
  '[EMPLOYEE] Leave employee',
  props<{ id: number, body: any }>()
);

const removeWorkHistory = createAction(
  '[EMPLOYEE] Remove Work History',
  props<{ id: number, employeeId: EmployeeEntity['id'] }>()
)

const removeHistorySalary = createAction(
  '[EMPLOYEE] Remove History Salary ',
  props<{ id: number, employeeId: number }>()
);

const removeContracts = createAction(
  '[EMPLOYEE] Remove Contracts  ',
  props<{ id: number, employeeId: number }>()
);

const error = createAction(
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
