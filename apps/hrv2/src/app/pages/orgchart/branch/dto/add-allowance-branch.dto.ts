import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseAllowanceBranchEntity } from '../../../../../../../../libs/orgchart-v2/src/lib/branch/entities';

export interface BaseAddAllowanceBranchDto extends BaseAllowanceBranchEntity {}

export type AddAllowanceBranchDto = BaseAddDto<BaseAddAllowanceBranchDto>;
