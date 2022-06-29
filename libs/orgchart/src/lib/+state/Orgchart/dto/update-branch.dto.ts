import { Branch } from '@minhdu-fontend/data-models';

export type UpdateBranchDto = Partial<Omit<Branch, 'id'>>;
