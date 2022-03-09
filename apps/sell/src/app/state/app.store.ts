import { TabEnum } from './app.entity';
import { ActiveState } from '@datorama/akita/lib/types';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface AppState extends ActiveState<TabEnum | string> {
  readonly active: TabEnum | string;
}

const createInitState = () => ({ active: TabEnum.DASHBOARD });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app' })
export class AppStore extends EntityStore<AppState> {
  constructor() {
    super(createInitState());
  }
}
