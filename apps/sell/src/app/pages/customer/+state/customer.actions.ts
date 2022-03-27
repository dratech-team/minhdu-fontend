import {createAction, props} from '@datorama/akita-ng-effects';
import {AddCustomerDto, UpdateCustomerDto} from '../dto';
import {SearchOrderDto} from '../../order/dto/search-order.dto';
import {SearchCustomerDto} from "../dto/search-customer.dto";

const addOne = createAction(
  '[CUSTOMER] Add One',
  props<AddCustomerDto>()
);

const loadAll = createAction(
  '[CUSTOMER] Load All',
  props<{ params: SearchCustomerDto, isPagination?: boolean }>()
);

const loadOne = createAction(
  'CUSTOMER] Load One',
  props<{ id: number }>()
);

const update = createAction(
  '[CUSTOMER] Update',
  props<{ id: number, updates: UpdateCustomerDto }>()
);

const remove = createAction(
  '[CUSTOMER] Remove',
  props<{ id: number }>()
);

const loadOrder = createAction(
  '[CUSTOMER] Load Order',
  props<{ params: SearchOrderDto, typeOrder: 'delivered' | 'delivering', isPagination?: boolean }>()
);

export const CustomerActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  loadOrder
};

