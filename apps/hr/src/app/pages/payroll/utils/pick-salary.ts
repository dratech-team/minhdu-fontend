import { Salary } from '@minhdu-fontend/data-models';

export const someComplete = (salaries: any[], salariesSelected: any[], isSelectSalary: boolean) => {
  return (
    salaries.filter(e => salariesSelected.some(item => item.salary.id === e.salary.id)).length > 0 && !isSelectSalary
  );
};


export const updateSelect = (salarySelected: any, salariesSelected: any[], isSelectSalary: boolean, salaries: any[]) => {
  const index = salariesSelected.findIndex(item => item.salary.id === salarySelected.salary.id);
  if (index > -1) {
    salariesSelected.splice(index, 1);
  } else {
    salariesSelected.push(salarySelected);
  }
  return isSelectSalary = salaries.length > 0 && salaries.every(e => salariesSelected.some(item =>
    item.salary.id === e.salary.id));
};

export const setAll = (
  select: boolean,
  salaries: any[],
  salariesSelected: any[],
  isTableSalary?: boolean
) => {
  salaries?.forEach((val) => {
    if (select) {
      if (!salariesSelected.some(item => item.salary.id === val.salary.id)) {
        salariesSelected.push(val);
      }
    } else {
      if (isTableSalary) {
        salariesSelected.length = 0;
      } else {
        const index = salariesSelected.findIndex(item => item.salary.id === val.salary.id);
        if (index > -1) {
          salariesSelected.splice(index, 1);
        }
      }
    }
  });
  return select;
};
