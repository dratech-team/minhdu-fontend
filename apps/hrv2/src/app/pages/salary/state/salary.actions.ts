import { createAction, props } from '@datorama/akita-ng-effects';
import {
  AddAbsentSalaryDto,
  AddOvertimeSalaryDto,
  RemoveSalaryDto,
  UpdateAbsentSalaryDto,
  UpdateOvertimeSalaryDto,
  UpdatePermanentSalaryDto,
} from '../dto';
import { AddPermanentSalaryDto } from '../dto/permanent-salary/add-permanent-salary.dto';
import { addManySalaryDto } from '../dto/salary/add-many.dto';
import { updateManySalaryDto } from '../dto/salary/update-many.dto';

//chưa dùng  tới hiện tại đang gọi trực tiếp từ service
const addOne = createAction(
  '[SALARY] Add One',
  props<AddPermanentSalaryDto | AddAbsentSalaryDto | AddOvertimeSalaryDto>()
);

const addMany = createAction('[SALARY] Add Many', props<addManySalaryDto>());

const update = createAction(
  '[SALARY] Update',
  props<
    UpdatePermanentSalaryDto | UpdateAbsentSalaryDto | UpdateOvertimeSalaryDto
  >()
);

const updateMany = createAction(
  '[SALARY] Update Many',
  props<updateManySalaryDto>()
);

const remove = createAction('[SALARY] Remove', props<RemoveSalaryDto>());

const error = createAction('[SALARY] error', props<{ error: string }>());

export const SalaryActions = {
  addOne,
  addMany,
  update,
  updateMany,
  remove,
  error,
};
