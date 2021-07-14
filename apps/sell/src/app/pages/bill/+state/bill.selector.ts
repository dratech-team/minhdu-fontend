import { BillState } from './bill.reducer';
import { Bill } from './Bill.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formBill from './bill.reducer'
export interface state{
  bill: BillState
}
export const getSelectedBillId = (state: Bill) => state.id
export const selectorBillState = createFeatureSelector<BillState>(
  FeatureName.BILL
)
export const selectorBillEntities = createSelector(
  selectorBillState,
  formBill.selectEntities
)
export const selectorAllBills = createSelector(
  selectorBillState,
  formBill.selectAll
)
export const selectorCurrentBill = ( id: number) => createSelector(
  selectorBillEntities,
  (BillEntities) => BillEntities[id]
)
export const selectedLoaded = createSelector(
  selectorBillState,
  (state) => state.loaded
)
