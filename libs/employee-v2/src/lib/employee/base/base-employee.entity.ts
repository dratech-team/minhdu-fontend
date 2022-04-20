import {BaseEntity} from "@minhdu-fontend/base-entity";
import {EmployeeType, Gender, RecipeType} from "@minhdu-fontend/enums";
import {Ward} from "@minhdu-fontend/data-models";

export interface BaseEmployeeEntity extends BaseEntity{
  code: string,
  lastName: string,
  avt?: string,
  gender: Gender,
  phone?: string,
  workPhone?: string,
  birthday: Date,
  birthplace: string,
  identify: string,
  idCardAt: Date,
  issuedBy: string,
  ward: Ward,
  address: string,
  email?: string,
  religion: string,
  ethnicity: string,
  mst?: string,
  createdAt: Date,
  workedAt: Date;
  workday: number,
  contractAt: string,
  leftAt: Date,
  isFlatSalary: boolean,
  note?: string;
  facebook: string,
  zalo: string,
  bhyt?: string,
  contractType?: string,
  recipeType: RecipeType,
  type: EmployeeType,
  isSelect?: boolean,
}
