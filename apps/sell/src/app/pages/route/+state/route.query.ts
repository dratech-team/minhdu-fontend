import { QueryEntity } from '@datorama/akita';
import { RouteState, RouteStore } from './route.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RouteQuery extends QueryEntity<RouteState> {
  constructor(protected store: RouteStore) {
    super(store);
  }
}
