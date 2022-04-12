import {Component, Input, OnInit} from "@angular/core";
import {Payroll} from "../../../../../hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'minhdu-fontend-table-payroll-selected',
  templateUrl: 'table-payroll-selected.component.html'
})
export class TablePayrollSelectedComponent {
  @Input() formGroup!: FormGroup
  setOfCheckedPayroll = new Set<Payroll>();
  payrolls:Payroll[] = Array.from(this.formGroup.get('payrolls')?.value)
  checked = true;
  indeterminate = true;


  onAllChecked($event: boolean) {
    //util
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfCheckedPayroll))
  }

  onItemChecked(payroll: Payroll, checked: boolean) {
    //util
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfCheckedPayroll))
  }
}
