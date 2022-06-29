import { EmployeeType, Gender, RecipeType } from '@minhdu-fontend/enums';

export interface EmployeeDto {
  take?: number;
  skip?: number;
  name?: string;
  workedAt?: Date;
  code?: string;
  position?: string;
  branch?: string;
  gender?: Gender;
  isSelect?: boolean;
  templateId?: number;
  createdPayroll?: Date;
  status?: number;
  employeeType?: EmployeeType;
  recipeType?: RecipeType;
  overtimeTitle?: string;
  categoryId?: number | '';
  isFlatSalary?: number;
}
