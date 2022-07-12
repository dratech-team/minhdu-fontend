import { BaseAccountEntity } from '../../base/base-account.entity';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';

export interface BaseSearchAccountDto extends Omit<BaseAccountEntity, 'id'> {
  branchIds: number[];
}

export type SearchAccountDto = BaseSearchDto<BaseSearchAccountDto>;
