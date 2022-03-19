import {createAction, props} from '@datorama/akita-ng-effects';
import {AddCustomerDto} from '../dto/add-customer.dto';
import {UpdateCustomerDto} from '../dto/update-customer.dto';
import {LoadCustomerDto} from '../dto/load-customer.dto';
import {LoadOrderDto} from '../../order/dto/load-order.dto';

const addOne = createAction(
  '[CUSTOMER] Add One',
  props<AddCustomerDto>()
);

const loadAll = createAction(
  '[CUSTOMER] Load All',
  props<{ params: LoadCustomerDto, isPagination?: boolean }>()
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
  props<{ params: LoadOrderDto, typeOrder: 'delivered' | 'delivering', isPagination?: boolean }>()
);

export const CustomerActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  loadOrder,
};

