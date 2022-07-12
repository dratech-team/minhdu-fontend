import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseRateConditionEntity } from '../../bases/base-rate-condition.entity';

export type BaseAddRateConditionDto = Omit<BaseRateConditionEntity, 'id'>;

export type AddRateConditionDto = BaseAddDto<BaseAddRateConditionDto>;
