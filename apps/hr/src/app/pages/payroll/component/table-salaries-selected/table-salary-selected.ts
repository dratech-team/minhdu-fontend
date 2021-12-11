import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee, Salary } from '@minhdu-fontend/data-models';
import { setAll, updateSelect } from '../../utils/pick-salary';

@Component({
  selector: 'app-table-salaries-selected',
  templateUrl: 'table-salaries-selected.html'
})
export class TableSalarySelected implements OnInit{
  @Input() salaries: Salary[] = []
  @Output() EmitSalariesSelected = new EventEmitter<Salary[]>()
  salariesSelected: Salary [] = []
  isSelectAll = true
  constructor() {
  }
  ngOnInit() {
    this.salariesSelected = this.salaries
  }

  updateSelectSalary(salary: Salary) {
    this.isSelectAll = updateSelect(
      salary,
      this.salariesSelected,
      this.isSelectAll,
      this.salaries
    );
  }

  setAllSalary(select: boolean) {
    this.isSelectAll = setAll(select, this.salaries, this.salariesSelected, true);
    this.EmitSalariesSelected.emit(this.salariesSelected)
  }

  selectSalary(salary: Salary) {
   const event = this.salariesSelected.some((e) => e.id === salary.id);
    this.EmitSalariesSelected.emit(this.salariesSelected)
    return event
  }
}
