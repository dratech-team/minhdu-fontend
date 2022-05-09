import { BaseEmployeeEntity } from '../../base';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export interface BaseAddEmployeeDto extends BaseEmployeeEntity {

}

export type AddEmployeeDto = BaseAddDto<BaseAddEmployeeDto>
