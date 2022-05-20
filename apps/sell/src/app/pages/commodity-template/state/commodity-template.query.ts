import {QueryEntity} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {CommodityTemplateState, CommodityTemplateStore} from "./commodity-template.store";

@Injectable({providedIn: 'root'})
export class CommodityTemplateQuery extends QueryEntity<CommodityTemplateState> {
  constructor(protected store: CommodityTemplateStore) {
    super(store);
  }
}
