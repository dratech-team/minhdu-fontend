import { RequireOnlyOne } from '../../../../../shared/types';
import { BranchEntity } from '@minhdu-fontend/orgchart-v2';

export interface ModalBranchData {
  add?: {
    branch?: BranchEntity;
  };
  update?: {
    branch: BranchEntity;
  };
}

export type DataAddOrUpBranch = RequireOnlyOne<
  ModalBranchData,
  'add' | 'update'
>;
