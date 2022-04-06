import {BaseEntity} from '@minhdu-fontend/base-entity';
import {CategoryEntity} from "../../category/entities";
import {ProviderEntity} from "../../provider/entities";
import {CategoryUnitEnum} from "../../category/enums";
import {Branch} from "@minhdu-fontend/data-models";

export interface BaseProductEntity extends BaseEntity {
  readonly name: string;
  readonly code: string;
  readonly category: CategoryEntity
  readonly supplier: ProviderEntity,
  readonly note?: string
  readonly unit: CategoryUnitEnum,
  readonly branch: Branch,
}
