import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { RouteState, RouteStore } from './route.store';

@Injectable({ providedIn: 'root' })
export class RouteQuery extends QueryEntity<RouteState> {
  constructor(protected store: RouteStore) {
    super(store);
  }
}
