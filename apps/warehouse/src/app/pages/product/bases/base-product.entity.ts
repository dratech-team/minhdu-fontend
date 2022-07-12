import { BaseEntity } from '@minhdu-fontend/base-entity';
import { WarehouseUnitEnum } from '../../warehouse/enums';
import { Branch } from '@minhdu-fontend/data-models';
import { TypeProductEnum } from '../enums';

export interface BaseProductEntity extends BaseEntity {
  readonly name: string;
  readonly code: string;
  readonly note?: string;
  readonly unit: WarehouseUnitEnum;
  readonly barcode?: string;
  readonly branches?: Branch[];
  readonly type: TypeProductEnum;
}
