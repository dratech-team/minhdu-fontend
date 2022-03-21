import {
  AfterViewInit,
  Component, DoCheck,
  EventEmitter,
  Input, IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {pickAll, pickOne} from "@minhdu-fontend/utils";

@Component({
  selector: 'app-table-allowance-Payroll',
  templateUrl: 'table-allowance-payroll.component.html'
})
export class TableAllowancePayrollComponent implements OnInit, OnChanges {
  @Input() payrolls: Payroll[] = [];
  @Input() checkAllowance: boolean = false;
  @Input() allowancePayrollSelected: Payroll[] = [];
  @Output() EventSelectPayroll = new EventEmitter<Payroll[]>();
  @Output() EventSelectAllowance = new EventEmitter<Payroll[]>();
  payrollsSelected: Payroll[] = [];
  isSelectAllPayroll = true;
  isSelectAllowance = true;
  differ: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payrolls) {
      if (changes.payrolls.currentValue.length == 0) {
        this.isSelectAllPayroll = false;
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllPayroll = true;
        this.isSelectAllowance =
          this.payrolls !== null &&
          this.payrolls.every((e) => this.allowancePayrollSelected.some(item => item.id === e.id));
      }
      this.payrollsSelected = [...changes.payrolls.currentValue];
    }
    if (changes.allowancePayrollSelected) {
      if (changes.allowancePayrollSelected.currentValue.length == 0) {
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllowance =
          this.payrolls !== null &&
          this.payrolls.every((e) => this.allowancePayrollSelected.some(item => item.id === e.id));
      }
    }
  }

  ngOnInit(): void {
    this.payrollsSelected = [...this.payrolls];
  }

  //check-box-employee
  updateSelectEmployee(payroll: Payroll) {
    const val = pickOne(payroll, this.payrollsSelected, this.payrolls, this.allowancePayrollSelected);
    this.isSelectAllPayroll = val.isSelectAll;
    this.isSelectAllowance = val.isSelectAllowance;
    this.EventSelectPayroll.emit(this.payrollsSelected);
    this.EventSelectAllowance.emit(this.allowancePayrollSelected);
  }


  setAllEmployee(select: boolean) {
    this.isSelectAllPayroll = select;
    if (this.payrolls.length === 0) {
      return;
    }
    this.isSelectAllowance = pickAll(
      select,
      this.payrolls,
      this.payrollsSelected,
      this.allowancePayrollSelected,
      this.isSelectAllowance);
    this.EventSelectPayroll.emit(this.payrollsSelected);
    this.EventSelectAllowance.emit(this.allowancePayrollSelected);
  }

  //check-box-allowance
  updateSelectAllowance(payroll: Payroll) {
    this.isSelectAllowance = pickOne(payroll, this.allowancePayrollSelected, this.payrolls).isSelectAll;
    this.EventSelectAllowance.emit(this.allowancePayrollSelected);
  }

  someCompleteAllowance(): boolean {
    return (
      this.payrolls.filter((e) => this.allowancePayrollSelected.some(item => item.id === e.id)).length >
      0 && !this.isSelectAllowance
    );
  }

  setAllAllowance(select: boolean) {
    this.isSelectAllowance = select;
    pickAll(select, this.payrolls, this.allowancePayrollSelected);
    this.EventSelectAllowance.emit(this.allowancePayrollSelected);
  }

  selectEmployee(payroll: Payroll) {
    return this.payrollsSelected.some((e) => e.id === payroll.id);
  }

  selectAllowanceEmployee(payroll: Payroll) {
    return this.allowancePayrollSelected.some((e) => e.id === payroll.id);
  }
}
