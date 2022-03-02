import { Department } from "../../index";
import { BaseOrgChart } from "./base-org-chart";
import {RecipeType} from "../../../enums";
export interface Position extends BaseOrgChart{
  workday?: number,
  _count?: any
}


