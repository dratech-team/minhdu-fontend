import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { RouterEnitty } from './app.entity';

export interface AppState extends EntityState {
  active: string;
  appName: string;
  breadcrumb: Array<RouterEnitty>,
}

function createInitialState(): AppState {
  return {
    active: 'tong-quan',
    appName: 'Hệ thống quản lý nhân sự',
    breadcrumb: []
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app' })
export class AppStore extends EntityStore<AppState> {
  constructor() {
    super(createInitialState());
  }
}
