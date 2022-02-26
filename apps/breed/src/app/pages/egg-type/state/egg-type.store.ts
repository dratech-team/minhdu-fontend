import { EggTypeEntity } from '../entities/egg-type.entity';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface EggTypeState extends EntityState<EggTypeEntity> {
  loading: boolean;
}

const createInitState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'egg-type' })
export class EggTypeStore extends EntityStore<EggTypeState> {
  constructor() {
    super(createInitState());
  }
}
