import { BaseOrgChart } from './base-org-chart';
import { Department } from './department';
import { Salary } from '../salary/salary';
import { Position } from './position';
import {RecipeType} from "../../../enums";

export interface Branch extends BaseOrgChart{
  recipe: RecipeType,
  code?:string,
  _count?:any,
  allowances?: Salary [],
  positions?: Position[]
}
