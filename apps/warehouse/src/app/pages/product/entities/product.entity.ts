import { BaseProductEntity } from '../bases';
import { IoiReceiptEntity } from '../../ioi-receipt/entities';
import { WarehouseEntity } from '../../warehouse/entities';
import { SupplierEntity } from '../../supplier/entities';
import { Branch } from '@minhdu-fontend/data-models';

export interface ProductEntity extends BaseProductEntity {
  readonly stocks: IoiReceiptEntity[];
  readonly category: WarehouseEntity;
  readonly supplier: SupplierEntity;
  readonly branches?: Branch[];
}
