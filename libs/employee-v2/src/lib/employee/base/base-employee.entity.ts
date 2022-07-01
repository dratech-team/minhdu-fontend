import { BaseEntity } from '@minhdu-fontend/base-entity';
import { EmployeeType, GenderTypeEnum, RecipeType } from '@minhdu-fontend/enums';

export interface BaseEmployeeEntity extends BaseEntity {
  gender: GenderTypeEnum;
  phone: string;
  identify: string;
  address: string;
  note: string;
  lastName: string;
  workPhone: string;
  religion: string;
  ethnicity: string;
  mst?: string;
  zalo?: string;
  bhyt?: string;
  facebook: string;
  birthplace: string;
  recipeType: RecipeType;
  createdAt: Date;
  workedAt?: Date;
  workday: number;
  idCardAt?: Date;
  issuedBy: string;
  birthday?: Date;
  email: string;
  type: EmployeeType;
}
