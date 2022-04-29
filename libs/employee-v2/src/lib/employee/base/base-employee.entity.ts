import {BaseEntity} from "@minhdu-fontend/base-entity";
import {EmployeeType, Gender, RecipeType} from "@minhdu-fontend/enums";
import {Ward} from "@minhdu-fontend/data-models";
import {PaginationDto} from "@minhdu-fontend/constants";

export interface BaseEmployeeEntity extends BaseEntity{
  code: string,
  gender: Gender,
  phone?: string,
  identify?: string,
  address: string,
  note?: string;
}

