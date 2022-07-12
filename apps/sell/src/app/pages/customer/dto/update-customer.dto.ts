import { BaseCustomerEntity } from '../entities/base-customer.entity';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import { CustomerType } from '@minhdu-fontend/enums';

export interface BaseUpdateCustomerDto extends Omit<BaseCustomerEntity, 'id'> {
  readonly provinceId: number;
  readonly districtId?: number;
  readonly wardId?: number;
  readonly customerType?: CustomerType;
}

export type UpdateCustomerDto = BaseUpdateDto<BaseUpdateCustomerDto>;
