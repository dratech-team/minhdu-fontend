import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateIncubatorFactoryDto } from '../dto/create-incubator-factory.dto';
import { SearchIncubatorFactoryDto } from '../dto/search-incubator-factory.dto';

const addEgg = createAction(
  '[EGG] Add Egg',
  props<CreateIncubatorFactoryDto>()
);

const loadAll = createAction(
  '[EGG] Load All',
  props<SearchIncubatorFactoryDto>()
);

export const IncubatorFactoryActions = {
  addEgg,
  loadAll,
};
