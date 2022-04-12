import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {PayrollService} from "../../../../../hr/src/app/pages/payroll/service/payroll.service";
import {EmployeeType, RecipeType} from "@minhdu-fontend/enums";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {Payroll} from "../../../../../hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {PaginationDto} from "@minhdu-fontend/constants";
import {NzMessageService} from "ng-zorro-antd/message";
import {refreshCheckedStatusUtil, updateCheckedSetUtil} from "../../utils";

@Component({
  selector: 'minhdu-fontend-table-select-payroll',
  templateUrl: 'table-select-payroll.component.html'
})
export class TableSelectPayrollComponent implements OnInit, OnChanges {
  @Input() formGroup!: FormGroup
  @Input() search!: {
    createdAt?: Date,
    templateId?: number,
    employeeType?: EmployeeType,
    recipeType?: RecipeType,
  }
  formTablePayroll = new FormGroup({
    name: new FormControl(''),
    position: new FormControl(''),
    branch: new FormControl(''),
    isLeave: new FormControl(false)
  })
  payrolls: Payroll[] = []
  total = 0
  checked = false;
  subChecked = false;
  indeterminate = false;
  subIndeterminate = false;
  setOfPayrollSelected = new Set<Payroll>();
  setOfSubPayrollSelected = new Set<Payroll>()

  constructor(
    private readonly payrollService: PayrollService,
    private readonly message: NzMessageService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search.currentValue !== changes.search.previousValue) {
      this.payrollService.paginationPayroll(this.mapPayroll(PaginationDto.take, PaginationDto.skip)).subscribe(res => {
        this.payrolls = res.data
        this.total = res.total
      })
    }
  }

  ngOnInit() {
    this.formGroup.get('payrolls')?.value.map((payroll: any) => this.setOfPayrollSelected.add(payroll))
    this.formGroup.get('subPayroll')?.value.map((payroll: any) => this.setOfSubPayrollSelected.add(payroll))
    this.formTablePayroll.valueChanges.subscribe(_ => {
      this.payrollService.paginationPayroll(this.mapPayroll(PaginationDto.take, PaginationDto.skip)).subscribe(res => {
        this.payrolls = res.data
        this.total = res.total
      })
    })
  }

  onScroll() {
    this.payrollService.paginationPayroll(
      this.mapPayroll(PaginationDto.take, this.payrolls.length)
    ).subscribe(res => {
      this.total = res.total
      if (res.data.length > 0) {
        this.payrolls = this.payrolls.concat(res.data)
      } else {
        this.message.info('Đã lấy hết dữ liệu')
      }
    })
  }

  mapPayroll(take: number, skip: number) {
    const valueForm = this.formTablePayroll.value
    Object.assign(valueForm,
      {
        take: take,
        skip: skip
      }
    )
    if (this.search.createdAt) {
      Object.assign(valueForm, {
        startedAt: getFirstDayInMonth(new Date(this.search.createdAt)),
        endedAt: getLastDayInMonth(new Date(this.search.createdAt)),
      })
    }
    if (this.search.employeeType) {
      Object.assign(valueForm, {employeeType: this.search.employeeType,})
    }
    if (this.search.templateId) {
      Object.assign(valueForm, {templateId: this.search.templateId,})
    }
    if (this.search.recipeType) {
      Object.assign(valueForm, {
        recipeType: this.search.recipeType,
      })
    }
    return valueForm
  }

  onAllChecked(checked: boolean): void {
    this.payrolls.forEach((payroll) => this.updateCheckedSet(payroll, checked));
    this.refreshCheckedStatus();
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfPayrollSelected))
  }


  updateCheckedSet(payroll: Payroll, checked: boolean): void {
    this.setOfPayrollSelected = updateCheckedSetUtil(payroll, checked, this.setOfPayrollSelected)
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfPayrollSelected))
  }

  refreshCheckedStatus(): void {
    const value = refreshCheckedStatusUtil(this.payrolls, this.setOfPayrollSelected, this.checked)
    this.checked = value.check
    this.indeterminate = value.indeterminate
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfPayrollSelected))
  }

  onItemChecked(payroll: Payroll, checked: boolean): void {
    this.updateCheckedSet(payroll, checked);
    this.refreshCheckedStatus();
  }


  //sub checked
  onAllSubChecked(checked: boolean): void {
    this.setOfPayrollSelected.forEach(payroll => this.updateSubCheckedSet(payroll, checked))
    this.refreshCheckedStatus();
    this.formGroup.get('payrolls')?.setValue(Array.from(this.setOfPayrollSelected))
  }

  updateSubCheckedSet(payroll: Payroll, checked: boolean): void {
    this.setOfSubPayrollSelected = updateCheckedSetUtil(payroll, checked, this.setOfSubPayrollSelected)
  }

  refreshSubCheckedStatus(): void {
    const value = refreshCheckedStatusUtil(this.payrolls, this.setOfSubPayrollSelected, this.subChecked)
    this.subChecked = value.check
    this.subIndeterminate = value.indeterminate
  }

  onItemSubChecked(payroll: Payroll, checked: boolean): void {
    this.updateSubCheckedSet(payroll, checked);
    this.refreshSubCheckedStatus();
  }
}
