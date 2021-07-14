import { createAction, props } from '@ngrx/store';
import { Nation } from '@minhdu-fontend/data-models';

export const loadAllNation = createAction(
  '[LOAD_NATION] Load All Nations'
)

export const loadAllNationsSuccess = createAction(
  '[LOAD_NATIONS] Load All Nations Success',
  props<{nations: Nation [] }>()
)

export const getNation = createAction(
  '[GET_NATIONS] Get Nation',
  props<{idNation: number}>()
)

export const getNationSuccess = createAction(
  '[GET_NATION] Get Nation Success',
  props<{nation: Nation}>()
)
export const NationAction = {
  loadAllNation,
  loadAllNationsSuccess,
  getNation,
  getNationSuccess
}
