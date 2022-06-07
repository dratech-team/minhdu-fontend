import {createAction, props} from "@datorama/akita-ng-effects";
import {AddPaymentDto} from "../dto/add-payment.dto";
import {UpdatePaymentDto} from "../dto/update-payment.dto";
import {RemovePaymentDto} from "../dto/remove-payment.dto";
import {SearchPaymentDto} from "../dto/search-payment.dto";


export const loadAll = createAction(
  '[PAYMENT] Load All',
  props<SearchPaymentDto>()
);

export const addOne = createAction(
  '[PAYMENT] Payment',
  props<AddPaymentDto>()
);

export const update = createAction(
  '[PAYMENT] Update',
  props<UpdatePaymentDto>()
);

export const remove = createAction(
  '[PAYMENT] Remove',
  props<RemovePaymentDto>()
);

export const error = createAction(
  '[PAYMENT]  Error',
  props<{ err: string }>()
);
export const PaymentActions = {
  loadAll,
  addOne,
  update,
  remove,
  error
};

