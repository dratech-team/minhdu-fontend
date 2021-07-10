import { CustomerType } from '@minhdu-fontend/enums';
import { CustomerResource } from '../../../../../../../../libs/enums/Customer-Resource';

export interface Customer {
  id: number,
  type: CustomerType,
  resource: CustomerResource,
}
