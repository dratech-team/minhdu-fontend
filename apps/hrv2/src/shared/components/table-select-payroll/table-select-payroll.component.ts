import {Component, Input, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollService} from "../../../app/pages/payroll/services/payroll.service";
import {PayrollEntity} from "../../../app/pages/payroll/entities";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {PaginationDto} from "@minhdu-fontend/constants";
import {EmployeeType, FilterTypeEnum} from "@minhdu-fontend/enums";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

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
  payrollIdsSelected = new Set<number>();

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

    this.formGroup.value.payrollIds.forEach((id: number) => this.payrollIdsSelected.add(id))

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
      ? Object.assign({}, this.mapPayroll(),
        {skip: PaginationDto.skip})
      : this.mapPayroll())
      .pipe(catchError(err => {
        this.loading = false
        return throwError(err)
      }))
      .subscribe(res => {
        this.loading = false
        pagination
          ? this.payrolls = this.payrolls.concat(res.data)
          : this.payrolls = res.data
      })
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.payrollIdsSelected.add(id);
    } else {
      this.payrollIdsSelected.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.payrolls.every(({id}) => this.payrollIdsSelected.has(id));
    this.indeterminate = this.payrolls.some(({id}) => this.payrollIdsSelected.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.formGroup.get('payrollIds')?.setValue(Array.from(this.payrollIdsSelected))
  }

  onAllChecked(checked: boolean): void {
    this.payrolls.forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.formGroup.get('payrollIds')?.setValue(Array.from(this.payrollIdsSelected))
  }
}
