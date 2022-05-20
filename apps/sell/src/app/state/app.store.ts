import { HrefEnum } from '../enums/href.enum';
import { ActiveState } from '@datorama/akita/lib/types';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface AppState extends ActiveState<HrefEnum | string> {
  readonly active: HrefEnum | string;
}

const createInitState = () => ({ active: HrefEnum.DASHBOARD });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app' })
export class AppStore extends EntityStore<AppState> {
  constructor() {
    super(createInitState());
  }
}
