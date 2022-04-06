import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConvertBooleanFrontEnd, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../reducers';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {selectedAddedPayroll, selectedAddingPayroll} from '../../../+state/payroll/payroll.selector';
import {selectorAllTemplate} from '../../../../template/+state/teamlate-salary/template-salary.selector';
import {TemplateSalaryAction} from '../../../../template/+state/teamlate-salary/template-salary.action';
import {SalaryService} from '../../../service/salary.service';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {Payroll} from "../../../+state/payroll/payroll.interface";

@Component({
  templateUrl: 'dialog-stay.component.html'
})
export class DialogStayComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  indexTitle = 0;
  tabindex = 0
  salariesStay$ = this.store.pipe(select(selectorAllTemplate));
  adding$ = this.store.select(selectedAddingPayroll)
  payrollSelected: Payroll[] = [];
  salariesSelected: SalaryPayroll[] = [];
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogStayComponent>,
    private readonly salaryService: SalaryService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
    if (this.data?.updateMultiple) {
      this.salariesSelected = this.data.salariesSelected;
    }
    if(this.data?.payroll){
      this.payrollSelected.push(this.data.payroll)
    }
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({ salaryType: SalaryTypeEnum.STAY }));
    if (this.data?.salary) {
      this.formGroup = this.formBuilder.group({
        title: [this.data?.salary?.title],
        price: [this.data?.salary?.price, Validators.required],
        rate: [1, Validators.required]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: [undefined, Validators.required],
        price: [undefined, Validators.required],
        rate: [1, Validators.required]
      });
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.data?.addMultiple && this.payrollSelected.length === 0) {
      return this.snackBar.open('Chưa chọn nhân viên', 'Đóng');
    }
    const value = this.formGroup.value;
    const salary = {
      title: value.title ? value.title : this.data?.salary?.title,
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
      type: this.data.type,
      rate: value.rate,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined,
      datetime: new Date(this.data?.payroll?.createdAt|| this.data?.createdAt)
    };
    this.store.dispatch(PayrollAction.updateStatePayroll({ added: ConvertBooleanFrontEnd.FALSE }));
    if (this.data?.isUpdate) {
      if (this.data?.updateMultiple) {
        this.salaryService.updateMultipleSalaryOvertime(
          {
            salaryIds: this.salariesSelected.map( e => e.salary.id),
            title: value.title ? value.title : this.data?.salary?.title,
            price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price
          }).subscribe(val => {
          if (val) {
            this.snackBar.open(val.message, '', { duration: 1500 });
            this.store.dispatch(PayrollAction.updateStatePayroll({ added: ConvertBooleanFrontEnd.FALSE }));
            this.dialogRef.close({title: value.title? value.title: this.data.salary.title});
          }
        });
      } else {
        this.store.dispatch(PayrollAction.updateSalary({
          payrollId: this.data.salary.payrollId, id: this.data.salary.id, salary: salary
        }));
      }
    } else {
        this.store.dispatch(PayrollAction.addSalary(this.payrollSelected.length === 1 &&
          this.payrollSelected[0].id == this.data?.payroll?.id ?
            {
              payrollId: this.data.payroll.id,
              salary: salary
            } :
            {
              salary: Object.assign(salary, {payrollIds: this.payrollSelected.map(val => val.id)}),
              isDetailPayroll: !!this.data?.payroll?.id,
              payrollId: this.data?.payroll?.id
            })
        );
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(added => {
      if (added) {
        this.dialogRef.close({title: salary.title});
      }
    });
  }

  setPrice(price: number) {
    this.formGroup.get('price')?.setValue(price);
  }


  pickPayroll(payrolls: Payroll[]) {
    this.payrollSelected = [...payrolls] ;
  }

  changeSalariesSelected($event: SalaryPayroll[]) {
    this.salariesSelected = $event;
    this.EmitSalariesSelected.emit(this.salariesSelected);
  }

  changeTab(indexTab: number) {
    this.tabindex = indexTab
  }
}
