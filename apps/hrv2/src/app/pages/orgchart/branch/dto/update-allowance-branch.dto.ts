import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import { BaseAllowanceBranchEntity } from '../../../../../../../../libs/orgchart-v2/src/lib/branch/entities';

export interface BaseUpdateAllowanceBranchDto
  extends BaseAllowanceBranchEntity {}

export type UpdateAllowanceBranchDto =
  BaseUpdateDto<BaseUpdateAllowanceBranchDto>;
