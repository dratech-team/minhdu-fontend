import {BaseEntity} from "@minhdu-fontend/base-entity";
import {EmployeeType, Gender, RecipeType} from "@minhdu-fontend/enums";
import {Ward} from "@minhdu-fontend/data-models";

export interface BaseEmployeeEntity extends BaseEntity{
  code: string,
  lastName: string,
  gender: Gender,
  phone?: string,
  birthday: Date,
  identify: string,
  idCardAt: Date,
  issuedBy: string,
  ward: Ward,
  address: string,
  email?: string,
  createdAt: Date,
  workedAt: Date;
  workday: number,
  contractAt: string,
  leftAt: Date,
  isFlatSalary: boolean,
  note?: string;
  contractType?: string,
  recipeType: RecipeType,
  type: EmployeeType,
}
