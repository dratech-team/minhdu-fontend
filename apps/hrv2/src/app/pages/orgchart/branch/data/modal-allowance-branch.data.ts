import { RequireOnlyOne } from '../../../../../shared/types';
import { BranchEntity } from '@minhdu-fontend/orgchart-v2';
import { AllowanceBranchEntity } from '../../../../../../../../libs/orgchart-v2/src/lib/branch/entities';

export interface ModalAllowanceBranchData {
  add?: {
    branch: BranchEntity;
  };
  update?: {
    allowance: AllowanceBranchEntity;
  };
}

export type DataAddOrUpAllowanceBranch = RequireOnlyOne<
  ModalAllowanceBranchData,
  'add' | 'update'
>;
