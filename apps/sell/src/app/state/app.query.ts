import { QueryEntity } from '@datorama/akita';
import { AppState, AppStore } from './app.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppQuery extends QueryEntity<AppState> {
  constructor(protected readonly store: AppStore) {
    super(store);
  }
}
