import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DatetimeUnitEnum, Gender, SalaryTypeEnum, SearchTypeEnum } from '@minhdu-fontend/enums';
import { SearchTypeConstant } from '@minhdu-fontend/constants';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { debounceTime } from 'rxjs/operators';
import { Salary } from '@minhdu-fontend/data-models';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { SalaryService } from '../../service/salary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedCreateAtPayroll, selectedLoadedPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { Router } from '@angular/router';
import { getState } from '../../../../../../../../libs/utils/getState.ultils';
import { DialogAbsentComponent } from '../dialog-salary/dialog-absent/dialog-absent.component';
import { DialogTimekeepingComponent } from '../dialog-salary/timekeeping/dialog-timekeeping.component';

@Component({
  selector: 'app-payroll-absent',
  templateUrl: 'payroll-absent.component.html'
})
export class PayrollAbsentComponent implements OnInit {
  @Input() eventAddAbsent?: Subject<any>;
  @Input() absentTitle?: string;
  pageType = PageTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  createdAt = getState(selectedCreateAtPayroll, this.store);
  formGroup = new FormGroup({
    title: new FormControl(''),
    name: new FormControl(''),
    createdAt: new FormControl(this.datePipe.transform(
      new Date(this.createdAt), 'yyyy-MM'
    )),
    searchType: new FormControl(SearchTypeEnum.CONTAINS)
  });
  totalSalaryAbsent$ = this.store.select(selectedTotalPayroll);
  searchTypeConstant = SearchTypeConstant;
  loaded$ = this.store.select(selectedLoadedPayroll);
  genderType = Gender;
  unit = DatetimeUnitEnum;
  payrollAbsent$ = this.store.pipe(select(selectorAllPayroll));
  salaryIds: number[] = [];
  isSelectSalary = false;
  salaries: Salary[] = [];
  pageSize = 30;
  pageIndex = 0;

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {
  }


  ngOnInit() {
    this.store.dispatch(PayrollAction.loadInit({
      take: this.pageSize,
      skip: this.pageIndex,
      createdAt: new Date(this.createdAt),
      salaryTitle: this.absentTitle ? this.absentTitle : '',
      salaryType: SalaryTypeEnum.ABSENT
    }));

    if (this.absentTitle) {
      this.formGroup.get('title')!.setValue(this.absentTitle, { emitEvent: false });
    }

    this.eventAddAbsent?.subscribe(val => {
      this.formGroup.get('title')!.setValue(val.absentTitle, { emitEvent: false });
      this.formGroup.get('createdAt')!.setValue(this.datePipe.transform(new Date(
        val.datetime ?
          val.datetime :
          getState(selectedCreateAtPayroll, this.store)
      ), 'yyyy-MM'), { emitEvent: false });
      this.store.dispatch(PayrollAction.loadInit({
        take: this.pageSize,
        skip: this.pageIndex,
        createdAt: new Date(
          val.datetime
            ? val.datetime
            : getState(selectedCreateAtPayroll, this.store)),
        salaryTitle: val.absentTitle ? val.absentTitle : '',
        salaryType: SalaryTypeEnum.ABSENT
      }));
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { createdAt: new Date(value.createdAt) }));
        this.store.dispatch(PayrollAction.loadInit(this.mapPayrollAbsent()));
      }
    );

    this.payrollAbsent$.subscribe(payrolls => {
      if (payrolls) {
        payrolls.forEach(payroll => {
          if (payroll.salaries) {
            payroll.salaries.forEach(salary => {
              if (salary.type === SalaryTypeEnum.ABSENT || salary.type === SalaryTypeEnum.DAY_OFF) {
                if (this.isSelectSalary && !this.salaryIds.includes(salary.id)
                  && !this.salaries.find(e => e.id === salary.id)) {
                  this.salaryIds.push(salary.id);
                }
                this.salaries.push(salary);
              }
            });
          }
        });
      }
    });
  }

  readPayroll(event: any) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', event.id]).then();
  }

  addSalaryAbsent() {
    const ref = this.dialog.open(DialogTimekeepingComponent,
      {
        width: 'fit-content'
      }
    );
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('title')!.setValue(val.title, { emitEvent: false });
        this.formGroup.get('createdAt')!.setValue(
          this.datePipe.transform(new Date(val.datetime ? val.datetime : this.formGroup.get('createdAt')!.value),
            'yyyy-MM'),
          { emitEvent: false });
        this.store.dispatch(PayrollAction.loadInit({
          take: this.pageSize,
          skip: this.pageIndex,
          createdAt: new Date(val.datetime ? val.datetime : this.formGroup.get('createdAt')!.value),
          salaryTitle: val.title,
          salaryType: SalaryTypeEnum.ABSENT
        }));
      }
    });
  }

  updateSalaryAbsent() {
    const value = this.formGroup.value;
    let salariesSelected: Salary[] = [];
    this.salaries.forEach(salary => {
      if (this.salaryIds.includes(salary.id)) {
        salariesSelected.push(salary);
      }
    });
    if (salariesSelected.every((value, index, array) => {
      return value.title === array[0].title;
    })) {
      const ref = this.dialog.open(DialogAbsentComponent, {
        width: '600px',
        data: {
          isUpdate: true,
          salary: salariesSelected[0],
          salaryIds: this.salaryIds,
          updateMultiple: true,
          createdAt: value.createdAt,
          type: SalaryTypeEnum.ABSENT

        }
      });
      console.log(salariesSelected[0]);
      ref.afterClosed().subscribe(
        val => {
          if (val) {
            this.isSelectSalary = false;
            this.salaryIds = [];
            this.formGroup.get('title')!.setValue(salariesSelected[0].title, { emitEvent: false });
            this.store.dispatch(PayrollAction.loadInit({
              take: this.pageSize,
              skip: this.pageIndex,
              searchType: value.searchType,
              createdAt: new Date(value.datetime ? value.datetime : value.createdAt),
              salaryTitle: salariesSelected[0].title,
              name: value.name,
              salaryType: SalaryTypeEnum.ABSENT
            }));
          }
        }
      );
    } else {
      this.snackbar.open('chưa chọn cùng loại  lương', 'Đóng');
    }
  }

  deleteSalaryAbsent(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.store.dispatch(PayrollAction.loadInit(this.mapPayrollAbsent()));
            this.snackbar.open('Xóa phiếu lương thành công', '', { duration: 1500 });
          }
        });
      }
    });
  }

  onScroll() {
    const value = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(this.mapPayrollAbsent()));
  }

  updateSelectSalary(id: number) {
    this.isSelectSalary = updateSelect(id, this.salaryIds, this.isSelectSalary, this.salaries);
  }

  someCompleteSalary(): boolean {
    return someComplete(this.salaries, this.salaryIds, this.isSelectSalary);
  }

  setAllSalary(select: boolean) {
    this.isSelectSalary = setAll(select, this.salaries, this.salaryIds);
  }

  mapPayrollAbsent() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      searchType: value.searchType,
      createdAt: new Date(value.createdAt),
      salaryTitle: value.title ? value.title : '',
      name: value.name
    };
    if (!value.name) {
      delete params.name;
    }
    return params;
  }
}
