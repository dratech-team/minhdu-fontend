import { BaseEntity } from '../entities';

export interface BaseAddDto<E extends Partial<Omit<BaseEntity, 'id'>>> {
  readonly body: E;
}
