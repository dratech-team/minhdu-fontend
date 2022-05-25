import {Component, Input, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollEntity} from "../../../app/pages/payroll/entities";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {PaginationDto} from "@minhdu-fontend/constants";
import {EmployeeType, FilterTypeEnum} from "@minhdu-fontend/enums";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {PayrollService} from "../../../app/pages/payroll/services/payroll.service";

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
  loadMore = false
  submitting = false
  checked = false
  indeterminate = false;
  total = 0
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

  onLoadMore() {
    this.onLoadPayroll(true)
  }

  mapPayroll() {
    const value = this.formGroupTable.value
    return {
      take: PaginationDto.subTake,
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
    pagination ? this.loadMore = true : this.loading = true
    this.payrollService.paginationPayroll(pagination
      ? Object.assign({}, this.mapPayroll(),
        {skip: pagination ? this.payrolls.length : PaginationDto.skip})
      : this.mapPayroll())
      .pipe(catchError(err => {
        this.loading = false
        return throwError(err)
      }))
      .subscribe(res => {
        this.total = res.total
        if (pagination) {
          this.loadMore = false
          this.payrolls = this.payrolls.concat(res.data)
        } else {
          this.loading = false
          this.payrolls = res.data
        }
        if(this.checked){
          this.onAllChecked(true)
        }else {
          this.refreshCheckedStatus()
        }
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
