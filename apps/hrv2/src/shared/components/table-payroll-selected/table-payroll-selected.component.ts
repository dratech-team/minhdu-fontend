import {Component, Input, OnInit} from "@angular/core";
import {Payroll} from "../../../../../hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'minhdu-fontend-table-payroll-selected',
  templateUrl: 'table-payroll-selected.component.html'
})
export class TablePayrollSelectedComponent implements OnInit {
  @Input() formGroup!: FormGroup
  setOfCheckedId = new Set<Payroll>();
  payrolls: Payroll[] = []
  checked = true;
  indeterminate = true;

  ngOnInit() {
    this.payrolls = Array.from(this.formGroup.get('payrolls')?.value)
  }

  onAllChecked($event: boolean) {
    //util
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfCheckedId))
  }

  onItemChecked(payroll: Payroll, checked: boolean) {
    //util
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfCheckedId))
  }
}
