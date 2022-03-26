import { BaseEntity } from '../entities';

export interface BaseUpdateDto<E extends Omit<BaseEntity, 'id'>> {
  readonly id: number;
  readonly updates: Partial<E>;
}
