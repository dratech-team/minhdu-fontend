import {Component, Input, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollService} from "../../../app/pages/payroll/services/payroll.service";
import {PayrollEntity} from "../../../app/pages/payroll/entities";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {PaginationDto} from "@minhdu-fontend/constants";
import {EmployeeType, FilterTypeEnum} from "@minhdu-fontend/enums";

@Component({
  selector: '@minhdu-fontend-select-payroll',
  templateUrl: 'table-select-payroll.component.html',
})
export class TableSelectPayrollComponent implements OnInit {
  @Input() formGroup!: FormGroup
  @Input() createdAt!: Date
  @Input() employeeType!: EmployeeType

  payrolls: PayrollEntity[] = []
  loading = true
  submitting = false
  pageSize = 10
  checked = false
  indeterminate = false;
  payrollIds = new Set<number>();

  formGroupTable = new FormGroup({
    branch: new FormControl(''),
    position: new FormControl(''),
    name: new FormControl('')
  })

  constructor(
    private readonly actions$: Actions,
    private readonly payrollService: PayrollService,
  ) {
  }

  ngOnInit() {
    this.onLoadPayroll(false)

    this.formGroupTable.valueChanges.subscribe(_ => {
      this.loading = true
      this.onLoadPayroll(false)
    })
  }

  onPagination(index: number) {
    if (index * this.pageSize >= this.payrolls.length) {
      this.onLoadPayroll(true)
    }
  }

  mapPayroll() {
    const value = this.formGroupTable.value
    return {
      take: PaginationDto.take,
      skip: PaginationDto.skip,
      name: value.name,
      branch: value.branch || '',
      position: value.position || '',
      empStatus: 1,
      startedAt: getFirstDayInMonth(new Date(this.createdAt)),
      endedAt: getLastDayInMonth(new Date(this.createdAt)),
      filterType: FilterTypeEnum.PAYROLL,
      employeeType: this.employeeType
    }
  }

  onLoadPayroll(pagination: boolean) {
    this.payrollService.paginationPayroll(pagination
      ? Object.assign({}, this.mapPayroll(), {skip: PaginationDto.skip})
      : this.mapPayroll()).subscribe(res => {
      this.loading = false
      pagination
        ? this.payrolls = this.payrolls.concat(res.data)
        : this.payrolls = res.data
    })
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.payrollIds.add(id);
    } else {
      this.payrollIds.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.payrolls.every(({id}) => this.payrollIds.has(id));
    this.indeterminate = this.payrolls.some(({id}) => this.payrollIds.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.formGroup.get('payrollIds')?.setValue(Array.from(this.payrollIds))
  }

  onAllChecked(checked: boolean): void {
    this.payrolls.forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.formGroup.get('payrollIds')?.setValue(Array.from(this.payrollIds))
  }
}
