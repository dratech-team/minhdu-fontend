import {createAction, props} from '@datorama/akita-ng-effects';
import {AddAbsentSalaryDto, RemoveSalaryDto, UpdateAbsentSalaryDto, UpdatePermanentSalaryDto} from '../dto';
import {AddPermanentSalaryDto} from "../dto/permanent-salary/add-permanent-salary.dto";
import {AddOvertimeSalaryDto} from "../dto/overtime-salary/add-overtime-salary.dto";
import {UpdateOvertimeSalaryDto} from "../dto/overtime-salary/update-overtime-salary.dto";

const addOne = createAction(
  '[SALARY] Add One',
  props<AddPermanentSalaryDto | AddAbsentSalaryDto | AddOvertimeSalaryDto>()
);

const update = createAction(
  '[SALARY] Update',
  props<UpdatePermanentSalaryDto | UpdateAbsentSalaryDto | UpdateOvertimeSalaryDto>()
);

const remove = createAction(
  '[SALARY] Remove',
  props<RemoveSalaryDto>()
);

const error = createAction(
  '[SALARY] error',
  props<{ error: string }>()
);

export const SalaryActions = {
  addOne,
  update,
  remove,
  error
};

