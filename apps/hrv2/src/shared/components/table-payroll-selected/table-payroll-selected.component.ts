import {Component, Input, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Payroll} from "../../../../../hr/src/app/pages/payroll/+state/payroll/payroll.interface";

@Component({
  selector: 'minhdu-fontend-table-payroll-selected',
  templateUrl: 'table-payroll-selected.component.html'
})
export class TablePayrollSelectedComponent implements OnInit {
  setOfCheckedId = new Set<number>();
  @Input() payrolls: Payroll[] = []

  ngOnInit() {
    this.payrolls.map(payroll => this.setOfCheckedId.add(payroll.id))
  }
}
