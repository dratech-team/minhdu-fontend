import {
  Component,
  EventEmitter,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { pickOne, someComplete } from '@minhdu-fontend/utils';

@Component({
  selector: 'app-table-employee-selected',
  templateUrl: './table-employee-selected.component.html'
})
export class TableEmployeeSelectedComponent implements OnInit, OnChanges {
  @Input() employees: Employee[] = [];
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  type = SalaryTypeEnum;
  isSelectAll = true;
  employeesSelected: Employee[] = [];
  employeeId!: number;
  differ: any;

  constructor(private differs: IterableDiffers, private readonly store: Store) {
    this.differ = differs.find([]).create(undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employees) {
      this.isSelectAll = changes.employees.currentValue.length > 0;
      this.employeesSelected = this.employees;
    }
  }

  ngOnInit(): void {
    if (this.employees.length === 0) {
      this.isSelectAll = false;
    }
    this.employeesSelected = [...this.employees];
  }

  updateSelect(employee: Employee) {
    this.isSelectAll = pickOne(
      employee,
      this.employeesSelected,
      this.employees
    ).isSelectAll;
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  someComplete(): boolean {
    return someComplete(
      this.employees,
      this.employeesSelected,
      this.isSelectAll
    );
  }

  setAll() {
    this.employeesSelected = [];
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  selectEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }
}
