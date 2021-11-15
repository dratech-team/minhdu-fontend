import { Salary } from '@minhdu-fontend/data-models';

export const someCompleteSalary = (salaries: Salary[], salaryIds: number[], isSelectSalary: boolean) => {
  return (
    salaries.filter(e => {
      return salaryIds.includes(e.id);
    }).length > 0
    && !isSelectSalary
  );
};


export const updateSelectSalary = (id: number, salaryIds: number[], isSelectSalary: boolean, salaries: Salary[]) => {
  const index = salaryIds.indexOf(id);
  if (index > -1) {
    salaryIds.splice(index, 1);
  } else {
    salaryIds.push(id);
  }
  isSelectSalary = salaries.every(e => {
    salaryIds.includes(e.id);
  });
};

export const setAllSalary = (
  select: boolean,
  isSelectSalary: boolean,
  salaries: Salary[],
  salaryIds: number[]
) => {
  isSelectSalary = select;
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
};
