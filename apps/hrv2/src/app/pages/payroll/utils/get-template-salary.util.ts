import { SalarySettingEntity } from '../../setting/salary/entities';

export const getTemplateSalaryUtil = (
  template: SalarySettingEntity[],
  id?: number
) => {
  return template.find((item) => item.id === (id ? id : 0));
};
