import {Component, Input, OnInit} from "@angular/core";
import {Payroll} from "../../../../../hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'minhdu-fontend-table-payroll-selected',
  templateUrl: 'table-payroll-selected.component.html'
})
export class TablePayrollSelectedComponent implements OnInit {
  @Input() formGroup!: FormGroup
  setOfCheckedId = new Set<number>();
  @Input() payrolls: Payroll[] = []
  checked = true;
  indeterminate = true;

  ngOnInit() {
    this.payrolls.map(payroll => this.setOfCheckedId.add(payroll.id))
  }

  onAllChecked($event: boolean) {
    //util
    this.formGroup.get('payrollIds')?.setValue(Array.from(this.setOfCheckedId))
  }

  onItemChecked(id: number, $event: boolean) {
    //util
    this.formGroup.get('payrollIds')?.setValue(Array.from(this.setOfCheckedId))
  }
}
