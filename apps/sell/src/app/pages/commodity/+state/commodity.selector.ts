
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Commodity } from './commodity.interface';
import { CommodityState } from './commodity.reducer';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formCommodity from './commodity.reducer'

export interface state {
  commodity: CommodityState
}
export const getSelectedCommodityId = (state: Commodity) => state.id;
export const selectorCommodityState = createFeatureSelector<CommodityState>(
  FeatureName.COMMODITY
)
export const selectorCommodityEntities = createSelector(
  selectorCommodityState,
  formCommodity.selectEntities
)
export const selectAllCommodity = createSelector(
  selectorCommodityState,
  formCommodity.selectAll
)
export const selectorCurrentCommodity = (id: number)  =>createSelector(
  selectorCommodityEntities,
  (CommodityEntities) => CommodityEntities[id]
)
export const selectorCommodityByIds = (ids: number[])  =>createSelector(
  selectAllCommodity,
  (CommoditiesEntities) =>{
    const result: Commodity[] = []
      CommoditiesEntities.forEach(val =>{
        if(ids.includes(val.id)){
          result.push(val)
        }
      })
    return result
  }
)
export const selectedLoaded = createSelector(
  selectorCommodityState,
  (state) => state.loaded
)

export const selectedTotalCommodity= createSelector(
  selectorCommodityState,
  (state) => state.total
)
export const selectorTotalCommodityInStore= createSelector(
  selectorCommodityState,
  formCommodity.selectTotal
);

