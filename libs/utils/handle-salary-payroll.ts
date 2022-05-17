import {Salary, SalaryPayroll} from '../data-models';
import * as moment from 'moment';
import {SalaryTypeEnum} from '../enums';
import {SalaryEntity} from "../../apps/hrv2/src/app/pages/salary/entities";


export const filterSalaryPayroll = (salaryPayrolls: SalaryPayroll[], salary: Salary) => {
  return salaryPayrolls.filter(salaryPayroll => {
    return salaryPayroll.salary.title === salary.title
      && isSame(salaryPayroll.salary.datetime, salary.datetime, (salary.type === SalaryTypeEnum.BASIC || salaryPayroll.salary.type === SalaryTypeEnum.STAY) ? 'month' : 'day')
      && salaryPayroll.salary?.price === salary.price
      && salaryPayroll.salary?.allowance?.price === salary?.allowance?.price
      && salaryPayroll.salary?.allowance?.title === salary?.allowance?.title;
  });
};

const isSame = (date1: Date, date2: Date, type: 'day' | 'month') => moment(date1).isSame(date2, type);

export const updateSelectOneSalaryPayroll = (event: boolean, salaryPayroll: SalaryPayroll, salaryPayrolls: SalaryPayroll[]) => {
  if (event) {
    salaryPayrolls.push(salaryPayroll);
  } else {
    const index = salaryPayrolls.findIndex(value => value.salary.id === salaryPayroll.salary.id);
    salaryPayrolls.splice(index, 1);
  }
};

export const filterSameSalary = (salaries: SalaryEntity[], salary: SalaryEntity) => {
  return salaries.filter(item => {
    return salary?.setting?.id === item?.setting?.id
      && salary?.price === item?.price
      && salary?.title === item?.title
      && ((salary.startedAt && item.startedAt)
        ? isSame(salary?.startedAt, item?.startedAt, 'day')
        : true)
      && ((salary.endedAt && item.endedAt)
        ? isSame(salary?.endedAt, item?.endedAt, 'day')
        : true)

  })
}
