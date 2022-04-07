import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {ConsignmentEntity} from '../entities';

export interface ConsignmentState extends EntityState<ConsignmentEntity> {
  loading: boolean;
  added: boolean|null;
}

export function createInitialState(): ConsignmentState {
  return {
    loading: true,
    added: null,
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'consignment'})
export class ConsignmentStore extends EntityStore<ConsignmentState> {
  constructor() {
    super(createInitialState());
  }
}
