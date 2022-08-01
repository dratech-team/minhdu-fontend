import { BaseBranchEntity } from '../bases';
import { RecipeType } from '@minhdu-fontend/enums';
import { PositionEntity } from '../../position/entities/position.entity';
import { AllowanceBranchEntity } from './allowance-branch.entity';

export interface BranchEntity extends BaseBranchEntity {
  recipe: RecipeType;
  _count: {
    employees: number;
    employeeLeft: number;
  };
  allowances: AllowanceBranchEntity[];
  positions: PositionEntity[];
}
