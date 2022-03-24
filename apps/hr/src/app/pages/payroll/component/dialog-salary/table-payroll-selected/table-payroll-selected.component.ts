import {
  Component, DoCheck,
  EventEmitter,
  Input, IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { pickAll, pickOne, someComplete } from '../../../../../../../../../libs/utils/pick-item.ultil';
import {Payroll} from "../../../+state/payroll/payroll.interface";

@Component({
  selector: 'app-table-payroll-selected',
  templateUrl: './table-payroll-selected.component.html'
})
export class TablePayrollSelectedComponent implements OnInit, OnChanges {
  @Input() payrolls: Payroll[] = [];
  @Output() EventSelectPayroll = new EventEmitter<Payroll[]>();
  type = SalaryTypeEnum;
  isSelectAll = true;
  payrollsSelected: Payroll[] = [];
  employeeId!: number;
  differ: any;

  constructor(
    private differs: IterableDiffers,
  ) {
    this.differ = differs.find([]).create(undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payrolls) {
      this.isSelectAll = changes.payrolls.currentValue.length > 0;
      this.payrollsSelected = this.payrolls;
    }
  }

  ngOnInit(): void {
    if (this.payrolls.length === 0) {
      this.isSelectAll = false;
    }
    this.payrollsSelected =[...this.payrolls];
  }


  updateSelect(payroll: Payroll) {
    this.isSelectAll = pickOne(payroll, this.payrollsSelected, this.payrolls).isSelectAll
    this.EventSelectPayroll.emit(this.payrollsSelected);
  }


  someComplete(): boolean {
    return someComplete(this.payrolls,this.payrollsSelected, this.isSelectAll)
  }

  setAll() {
    this.payrollsSelected = []
    this.EventSelectPayroll.emit(this.payrollsSelected);
  }

  selectEmployee(payroll: Payroll) {
    return this.payrollsSelected.some((e) => e.id === payroll.id);
  }
}
