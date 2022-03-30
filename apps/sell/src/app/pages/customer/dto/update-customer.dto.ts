import { BaseCustomerEntity } from '../entities/base-customer.entity';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

type BaseUpdateCustomerDto = BaseCustomerEntity

export type UpdateCustomerDto = BaseUpdateDto<BaseUpdateCustomerDto>
