import { BaseCustomerEntity } from '../entities/base-customer.entity';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

interface BaseUpdateCustomerDto extends BaseCustomerEntity {

}

export interface UpdateCustomerDto extends BaseUpdateDto<BaseUpdateCustomerDto> {
}
