import { EntityState, EntityStore, getEntityType, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { StorageName } from '@minhdu-fontend/constants';
import { BaseSearchCommodityTemplateDto } from '../dto/search-commodity-template.dto';
import { CommodityTemplateEntity } from '../entities';

export interface CommodityTemplateState
  extends EntityState<CommodityTemplateEntity> {
  readonly loading: boolean;
  readonly total: number;
  readonly remain: number;
  readonly search: Partial<BaseSearchCommodityTemplateDto>;
}

function createInitState(): CommodityTemplateState {
  return {
    loading: true,
    total: 0,
    remain: 0,
    search: {
      name: '',
      code: ''
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.COMMODITY_TEMPLATE })
export class CommodityTemplateStore extends EntityStore<CommodityTemplateState> {
  constructor() {
    super(createInitState());
  }
}
