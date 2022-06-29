import { BaseEntity } from '@minhdu-fontend/base-entity';
import { Employee } from '@minhdu-fontend/data-models';

export interface BaseSettingRankEntity extends BaseEntity {
  from: number;
  to: number;
  rank: string;
}
