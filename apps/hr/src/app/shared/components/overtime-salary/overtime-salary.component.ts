import {Component, Inject, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {Store} from "@ngrx/store";
import {AppState} from "../../../reducers";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {SalaryService} from "../../../pages/payroll/service/salary.service";
import {PartialDayEnum, Salary, SalaryPayroll} from "@minhdu-fontend/data-models";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {DatetimeUnitEnum, RecipeType} from "@minhdu-fontend/enums";
import {TitleSessionConstant} from "../../constant";
import {selectedAddedPayroll} from "../../../pages/payroll/+state/payroll/payroll.selector";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'minhdu-fontend-salary-overtime',
  templateUrl: 'overtime-salary.component.html'
})
export class OvertimeSalaryComponent implements OnInit {
  added$ = this.store.select(selectedAddedPayroll)
  formGroup!: FormGroup
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  salariesSelected: SalaryPayroll[] = [];
  isAllowanceOvertime = false;
  titleSession =TitleSessionConstant
  constructor(
    public datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
    private readonly salaryService: SalaryService,
    private readonly dialogRef: MatDialogRef<OvertimeSalaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      createdAt: Date,
      update?: {
        salary: Salary
        recipeType?: RecipeType
      },
      multiple?: {
        salariesSelected: SalaryPayroll[]
      }, },

  ) {
  }

  ngOnInit() {
    this.firstDayInMonth = this.datePipe.transform(
      getFirstDayInMonth(new Date(this.data.createdAt)), 'yyyy-MM-dd');
    this.lastDayInMonth = this.datePipe.transform(
      getLastDayInMonth(new Date(this.data.createdAt)), 'yyyy-MM-dd');
    if (this.data?.multiple) {
      this.salariesSelected = this.data.multiple.salariesSelected
    }
    if (this.data?.update) {
      if (this.data.update.salary?.allowance) {
        this.isAllowanceOvertime = true
      }
      this.formGroup = this.formBuilder.group({
        title: [this.data.update.salary.title],
        datetime: [
          this.datePipe.transform(
            this.data.update.salary.datetime, 'yyyy-MM-dd')],
        note: [this.data.update.salary.note],
        times: [!this.data.update.salary?.unit && this.data.update.salary.partial !== PartialDayEnum.ALL_DAY ?
          this.data.update.salary.times * 2
          : this.data.update.salary.times
        ],
        rate: [this.data.update.salary?.rate],
        unit: [this.data.update?.recipeType === RecipeType.CT4 && !this.data.update.salary.unit ?
          DatetimeUnitEnum.OPTION
          : this.data.update.salary.unit],
        price: [this.data.update.salary.price],
        days: [this.data.update.salary.times],
        priceAllowance: [this.data.update.salary.allowance?.price],
        titleAllowance: [this.data.update.salary.allowance?.title],
        partial: [this.titleSession.find(title => title.type === this.data.update?.salary.partial)]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: [''],
        datetime: [this.datePipe.transform(
          this.data.createdAt, 'yyyy-MM-dd')],
        month: [undefined],
        note: [''],
        times: [1],
        days: [1],
        unit: [],
        rate: [],
        price: [''],
        priceAllowance: [],
        titleAllowance: [],
        partial: []
      });
    }
  }

  onSubmit():any{
    if(this.data?.update){

    }else{

    }
    this.added$.subscribe(added => {
      if(added){
        this.dialogRef.close()
      }
    })
  }
}
