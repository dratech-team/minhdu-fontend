import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateEggTypeDto } from '../dto/create-egg-type.dto';

const addOne = createAction(
  '[EGG-TYPE] Add Egg Type',
  props<CreateEggTypeDto>()
);

const loadAll = createAction('[EGG-TYPE] Load All Egg Type');

export const EggTypeActions = {
  addOne,
  loadAll,
};
