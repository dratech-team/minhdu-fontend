import {BaseEntity} from '@minhdu-fontend/base-entity';
import {ProductEntity} from "../../product/entities";

export interface BaseCategoryEntity extends BaseEntity {
  readonly name: string
  readonly products: ProductEntity[]
}
