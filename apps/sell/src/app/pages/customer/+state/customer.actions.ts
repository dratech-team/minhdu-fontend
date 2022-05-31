import { createAction, props } from '@datorama/akita-ng-effects';
import { AddCustomerDto, LoadOneCustomerDto, RemoveCustomerDto, SearchCustomerDto, UpdateCustomerDto } from '../dto';
import { SearchOrderDto } from '../../order/dto';
import {StatusOrder} from "@minhdu-fontend/enums";

const addOne = createAction(
  '[CUSTOMER] Add One',
  props<AddCustomerDto>()
);

const loadAll = createAction(
  '[CUSTOMER] Load All',
  props<SearchCustomerDto>()
);

const loadOne = createAction(
  'CUSTOMER] Load One',
  props<LoadOneCustomerDto>()
);

const update = createAction(
  '[CUSTOMER] Update',
  props<UpdateCustomerDto>()
);

const remove = createAction(
  '[CUSTOMER] Remove',
  props<RemoveCustomerDto>()
);

const loadOrder = createAction(
  '[CUSTOMER] Load Order',
  props<{
    params: SearchOrderDto,
    typeOrder: 'delivered' | 'delivering',
    isPagination?: boolean,
  }>()
);

const error = createAction(
  '[CUSTOMER] error',
  props<{error: string}>()
);

export const CustomerActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  loadOrder,
  error
};

