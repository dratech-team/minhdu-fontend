import { BaseEntity } from '@minhdu-fontend/base-entity';

export interface BaseCommodityTemplateEntity extends BaseEntity {
  readonly code: string;
  readonly name: string;
}
