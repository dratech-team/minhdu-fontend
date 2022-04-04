import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface AppState extends EntityState {
  ui: {
    appname: string;
  }
}

function createInitialState(): AppState {
  return {
    ui: {
      appname: 'Hệ thống quản lý kho Minh Dư'
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app' })
export class AppStore extends EntityStore<AppState> {
  constructor() {
    super(createInitialState());
  }
}
