import {BaseEntity} from '../../../../../../../libs/entities';
import {CategoryEntity} from "../../category/entities";
import {ProviderEntity} from "../../provider/entities";
import {CategoryUnitEnum} from "../../category/enums";

export interface BaseProductEntity extends BaseEntity {
  readonly name: string;
  readonly code: string;
  readonly category: CategoryEntity
  readonly supplier: ProviderEntity,
  readonly note?: string
  readonly unit: CategoryUnitEnum
}
