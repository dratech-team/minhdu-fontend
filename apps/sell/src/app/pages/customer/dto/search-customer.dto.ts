import { BaseCustomerEntity } from '../entities/base-customer.entity';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';

export interface BaseSearchCustomerDto extends Omit<BaseCustomerEntity, 'isPotential' | 'id'> {
  readonly search?: string;
  readonly orderBy?: string;
  readonly orderType?: string;
  readonly isPotential?: -1 | 0 | 1;
}

export interface SearchCustomerDto extends BaseSearchDto<BaseSearchCustomerDto> {
}
