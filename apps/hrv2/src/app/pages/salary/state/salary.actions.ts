import {createAction, props} from '@datorama/akita-ng-effects';
import {AddSalaryDto, RemoveSalaryDto, UpdateSalaryDto} from '../dto';

const addOne = createAction(
  '[SALARY] Add One',
  props<AddSalaryDto>()
);

const update = createAction(
  '[SALARY] Update',
  props<UpdateSalaryDto>()
);

const remove = createAction(
  '[SALARY] Remove',
  props<RemoveSalaryDto>()
);

const error = createAction(
  '[SALARY] error',
  props<{error: string}>()
);

export const SalaryActions = {
  addOne,
  update,
  remove,
  error
};

