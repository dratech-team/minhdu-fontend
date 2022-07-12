import { BaseRankEntity } from '../../bases/base-rank.entity';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export interface BaseAddRankDto extends BaseRankEntity {}

export type AddRankDto = BaseAddDto<BaseAddRankDto>;
