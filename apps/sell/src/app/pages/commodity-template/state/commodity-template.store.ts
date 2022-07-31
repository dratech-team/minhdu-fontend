import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { StorageName } from '@minhdu-fontend/constants';
import { BaseSearchCommodityTemplateDto } from '../dto/search-commodity-template.dto';
import { CommodityTemplateEntity } from '../entities';
import { VisibleEntity } from '@minhdu-fontend/data-models';

export interface CommodityTemplateState
  extends EntityState<CommodityTemplateEntity> {
  readonly loading: boolean;
  readonly total: number;
  readonly remain: number;
  readonly search: Partial<BaseSearchCommodityTemplateDto>;
  readonly ui: VisibleEntity;
}

function createInitState(): CommodityTemplateState {
  return {
    loading: true,
    total: 0,
    remain: 0,
    ui: { pinned: false, visible: false },
    search: {
      name: '',
      code: ''
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.COMMODITY_TEMPLATE, resettable: true })
export class CommodityTemplateStore extends EntityStore<CommodityTemplateState> {
  constructor() {
    super(createInitState());
  }
}
