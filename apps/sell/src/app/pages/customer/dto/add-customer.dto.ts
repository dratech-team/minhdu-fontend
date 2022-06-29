import { CustomerType } from '@minhdu-fontend/enums';
import { BaseCustomerEntity } from '../entities/base-customer.entity';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export interface BaseAddCustomer extends Omit<BaseCustomerEntity, 'id'> {
  readonly provinceId: number;
  readonly districtId?: number;
  readonly wardId?: number;
  readonly customerType?: CustomerType;
}

export type AddCustomerDto = BaseAddDto<BaseAddCustomer>;
