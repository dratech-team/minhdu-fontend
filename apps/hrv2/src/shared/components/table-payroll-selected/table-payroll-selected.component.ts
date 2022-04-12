import {Component, Input, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
  selector:'minhdu-fontend-table-payroll-selected',
  templateUrl: 'table-payroll-selected.component.html'
})
export class TablePayrollSelectedComponent implements OnInit{
  @Input() formGroup!: FormGroup
  constructor() {
  }
  ngOnInit() {
    this.formGroup.get('payrollIds')!.value

    })
  }
}
