import { BaseEntity } from '../entities';

export interface BaseAddDto<E extends Omit<BaseEntity, 'id'>> {
  readonly body: Partial<Omit<E, 'id'>>;
}
