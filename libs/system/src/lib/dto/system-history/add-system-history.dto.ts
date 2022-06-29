import { BaseAddDto } from '../../../../../dto';
import { BaseSystemHistoryEntity } from '../../base/base-system-history.entity';

export interface BaseAddASystemHistoryDto extends BaseSystemHistoryEntity {}

export type AddSystemHistoryDto = BaseAddDto<BaseAddASystemHistoryDto>;
