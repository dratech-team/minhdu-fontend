import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Bill } from './Bill.interface';
import { createReducer, on } from '@ngrx/store';
import { BillAction } from './bill.action';

export interface BillState extends EntityState<Bill> {
  loaded: boolean,
  selectedBillId: number,
}

export const adapter: EntityAdapter<Bill> = createEntityAdapter<Bill>();
export const initialBill = adapter.getInitialState({ loaded: false });
export const BillReducer = createReducer(
  initialBill,
  on(BillAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.bills, { ...state, loaded: true })
  ),
  on(BillAction.loadMoreBillsSuccess, (state, action) =>
    adapter.addMany(action.bills, { ...state, loaded: true })
  )
);
export const { selectAll, selectEntities } = adapter.getSelectors();
