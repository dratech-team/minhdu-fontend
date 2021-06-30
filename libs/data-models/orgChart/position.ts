import { Department } from "..";
import { BaseOrgChart } from "./base-org-chart";
export interface Position extends BaseOrgChart{
  workday: number,
  department: Department,
  departmentId: number,
}
