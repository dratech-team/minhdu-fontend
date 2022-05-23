import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { SettingBonusStore, SettingBonusState} from "./setting-bonus.store";

@Injectable({ providedIn: 'root' })
export class SettingBonusQuery extends QueryEntity<SettingBonusState> {
  constructor(protected store: SettingBonusStore) {
    super(store);
  }
}
