import { SalaryTypeEnum } from '@minhdu-fontend/enums';

export interface TemplateBasicSalary {
  id: number,
  title: string,
  price: number,
  type: SalaryTypeEnum,
  positionId: any
}
