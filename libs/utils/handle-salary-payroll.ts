import { Salary, SalaryPayroll } from '../data-models';
import * as moment from 'moment';
import { SalaryTypeEnum } from '../enums';


export const filterSalaryPayroll = (salaryPayrolls: SalaryPayroll[], salary: Salary) => {
  return salaryPayrolls.filter(salaryPayroll => {
    console.log(moment(salaryPayroll.salary.datetime).isSame(salary.datetime, 'day'));
    return (salaryPayroll.salary.title === salaryPayroll.salary.title
      && (
        (salary.type === SalaryTypeEnum.BASIC || salaryPayroll.salary.type === SalaryTypeEnum.STAY) ?
          moment(salaryPayroll.salary.datetime).isSame(salary.datetime, 'month') :
          moment(salaryPayroll.salary.datetime).isSame(salary.datetime, 'day')
      )
      && (salaryPayroll.salary.price ?
        salaryPayroll.salary.price === salaryPayroll.salary.price : true)
      && (salaryPayroll.salary?.allowance ?
        (salaryPayroll.salary?.allowance?.price === salaryPayroll.salary.allowance.price
          && salaryPayroll.salary?.allowance?.title === salaryPayroll.salary.allowance.title
        ) : true)
    );
  });
};

export const updateSelectOneSalaryPayroll = (event: boolean, salaryPayroll: SalaryPayroll, salaryPayrolls: SalaryPayroll[]) => {
  if (event) {
    salaryPayrolls.push(salaryPayroll);
  } else {
    const index = salaryPayrolls.findIndex(value => value.salary.id === salaryPayroll.salary.id);
    salaryPayrolls.splice(index, 1);
  }
};

