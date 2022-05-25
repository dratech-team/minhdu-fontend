import {Branch, Department} from "../../index";
import { BaseOrgChart } from "./base-org-chart";
import {RecipeType} from "../../../enums";
export interface Position extends BaseOrgChart{
  code: string
  workday?: number,
  branches?: Branch[]
  _count?: any
}


