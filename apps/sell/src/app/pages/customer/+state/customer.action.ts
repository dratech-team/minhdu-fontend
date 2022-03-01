import { createAction, props } from '@ngrx/store';
import { CustomerType, Gender } from '@minhdu-fontend/enums';

const addOne = createAction(
  '[CUSTOMER] Add One',
  props<{ customer: any }>()
);

const loadAll = createAction(
  '[CUSTOMER] Load All',
  props<{
    skip: number,
    take: number,
    type?: string,
    resource?: string,
    isPotential?: number,
    phone?: number,
    nationId?: number,
    gender?: Gender,
    birthDay?: Date,
    email?: string,
    note?: string,
    customerType?: CustomerType,
    customer?: string,
  }>()
);

const getOne = createAction(
  '[CUSTOMER] Get One ',
  props<{ id: number }>()
);

const update = createAction(
  '[CUSTOMER] Update',
  props<{ id: number, updates: any, }>()
);


const remove = createAction(
  '[CUSTOMER] Remove',
  props<{ id: number }>()
);

export const CustomerAction = { addOne, loadAll, getOne, update, remove };

