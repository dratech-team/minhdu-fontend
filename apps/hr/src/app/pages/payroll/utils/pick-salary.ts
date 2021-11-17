import { Salary } from '@minhdu-fontend/data-models';

export const someComplete = (salaries: Salary[], salaryIds: number[], isSelectSalary: boolean) => {
  return (
    salaries.filter(e => salaryIds.includes(e.id)).length > 0 && !isSelectSalary
  );
};


export const updateSelect = (id: number, salaryIds: number[], isSelectSalary: boolean, salaries: Salary[]) => {
  const index = salaryIds.indexOf(id);
  if (index > -1) {
    salaryIds.splice(index, 1);
  } else {
    salaryIds.push(id);
  }
  return  isSelectSalary = salaries !== null && salaries.every(e => salaryIds.includes(e.id))
};

export const setAll = (
  select: boolean,
  salaries: Salary[],
  salaryIds: number[]
) => {

  salaries?.forEach((salary) => {
    if (select) {
      if (!salaryIds.includes(salary.id)) {
        salaryIds.push(salary.id);
      }
    } else {
      const index = salaryIds.indexOf(salary.id);
      if (index > -1) {
        salaryIds.splice(index, 1);
      }
    }
  });
  return select
};
