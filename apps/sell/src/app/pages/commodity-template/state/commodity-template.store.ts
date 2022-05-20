import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {BaseSearchCommodityTemplateDto} from "../dto/search-commodity-template.dto";
import {CommodityTemplateEntity} from "../entities";

export interface CommodityTemplateState extends EntityState<CommodityTemplateEntity> {
  loading: boolean;
  added: boolean | null;
  total: number
  search: Partial<BaseSearchCommodityTemplateDto>;
  deleted: boolean | null
}

function createInitState(): CommodityTemplateState {
  return {
    loading: true,
    added: null,
    total: 0,
    search: {
      name: '',
      code: ''
    },
    deleted: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.COMMODITY_TEMPLATE})
export class CommodityTemplateStore extends EntityStore<CommodityTemplateState> {
  constructor() {
    super(createInitState());
  }
}
