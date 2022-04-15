import {BaseEntity} from "@minhdu-fontend/base-entity";
import {SalaryEntity} from "./salary.entity";
import {Branch} from "@minhdu-fontend/data-models";

export interface SalaryAllowanceEntity extends BaseEntity {
  title: string,
  price: number,
  rate: number,
  salary: SalaryEntity,
  branch: Branch
}
