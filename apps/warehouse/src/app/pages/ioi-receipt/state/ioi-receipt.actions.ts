import { createAction, props } from '@datorama/akita-ng-effects';
import {AddIoiReceiptDto, SearchIoiReceiptDto, UpdateIoiReceiptDto} from '../dto';
import { IoiReceiptEntity } from '../entities';

const addOne = createAction(
  '[IOI_RECEIPT] Add One',
  props<AddIoiReceiptDto>()
);

const loadAll = createAction(
  '[IOI_RECEIPT] Load All',
  props<{ params: SearchIoiReceiptDto, isPagination?: boolean }>()
);

const getOne = createAction(
  '[IOI_RECEIPT] Get One',
  props<{ id: IoiReceiptEntity['id'] }>()
);

const update = createAction(
  '[IOI_RECEIPT] Update',
  props<UpdateIoiReceiptDto>()
);

const remove = createAction(
  '[IOI_RECEIPT] Delete',
  props<{ id: IoiReceiptEntity['id'] }>()
);

export const IoiReceiptActions = { addOne, loadAll, getOne, update, remove };
