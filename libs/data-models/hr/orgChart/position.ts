import { Department } from "../../index";
import { BaseOrgChart } from "./base-org-chart";
export interface Position extends BaseOrgChart{
  workday?: number,
  _count?: any
}


