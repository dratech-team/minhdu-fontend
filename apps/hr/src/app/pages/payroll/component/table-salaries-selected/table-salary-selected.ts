import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee, Salary, SalaryPayroll } from '@minhdu-fontend/data-models';
import { setAll, updateSelect } from '../../utils/pick-salary';

@Component({
  selector: 'app-table-salaries-selected',
  templateUrl: 'table-salaries-selected.html',
})
export class TableSalarySelected implements OnInit {
  @Input() salaries: SalaryPayroll[] = [];
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  salariesSelected: SalaryPayroll[] = [];
  isSelectAll = true;
  constructor() {}
  ngOnInit() {
    this.salariesSelected = this.salaries;
  }

  updateSelectSalary(salarySelected: SalaryPayroll) {
    this.isSelectAll = updateSelect(
      salarySelected,
      this.salariesSelected,
      this.isSelectAll,
      this.salaries
    );
  }

  setAllSalary(select: boolean) {
    this.isSelectAll = setAll(
      select,
      this.salaries,
      this.salariesSelected,
      true
    );
    this.EmitSalariesSelected.emit(this.salariesSelected);
  }

  selectSalary(salary: Salary) {
    const event = this.salariesSelected.some((e) => e.salary.id === salary.id);
    this.EmitSalariesSelected.emit(this.salariesSelected);
    return event;
  }
}
