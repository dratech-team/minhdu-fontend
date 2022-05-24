import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {ContractEntity} from "../../entities/contract.entity";

export interface ContractState extends EntityState<ContractEntity> {
  total: number
  remain: number
  loading: boolean;
  loadMore: boolean;
  added: boolean | null;
  search?: Partial<ContractEntity>;
  deleted: boolean | null
}

function createInitState(): ContractState {
  return {
    total: 0,
    remain: 0,
    loading: true,
    loadMore: false,
    added: null,
    deleted: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.CONTRACT})
export class ContractStore extends EntityStore<ContractState> {
  constructor() {
    super(createInitState());
  }
}
