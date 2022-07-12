import { BaseOrgChart } from './base-org-chart';
import { Department } from './department';
import { Salary } from '../salary/salary';
import { Position } from './position';
import { RecipeType } from '../../../enums';
import * as buffer from 'buffer';

export interface Branch extends BaseOrgChart {
  recipe: RecipeType;
  code?: string;
  _count?: any;
  allowances?: Salary[];
  positions?: Position[];
  positionIds?: number[];
  phone?: string;
  address?: string;
  status?: boolean;
}
