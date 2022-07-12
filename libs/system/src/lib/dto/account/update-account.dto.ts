import { BaseAccountEntity } from '../../base/base-account.entity';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdateAccount extends BaseAccountEntity {
  branchIds: number[];
  password: string;
}

export type UpdateAccountDto = BaseUpdateDto<BaseUpdateAccount>;
