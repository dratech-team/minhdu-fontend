import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { DatetimeUnitEnum, FilterTypeEnum, Gender, SalaryTypeEnum, SearchTypeEnum } from '@minhdu-fontend/enums';
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
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { Router } from '@angular/router';
import { getState } from '../../../../../../../../libs/utils/getState.ultils';
import { DialogStayComponent } from '../dialog-salary/dialog-stay/dialog-stay.component';
import { selectorAllTemplate } from '../../../template/+state/teamlate-salary/template-salary.selector';
import { TemplateSalaryAction } from '../../../template/+state/teamlate-salary/template-salary.action';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payroll-stay',
  templateUrl: 'payroll-stay.component.html'
})
export class PayrollStayComponent implements OnInit {
  pageType = PageTypeEnum;
  @Input() eventExportStay?: Subject<boolean>;
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
  totalSalaryStay$ = this.store.select(selectedTotalPayroll);
  searchTypeConstant = SearchTypeConstant;
  loaded$ = this.store.select(selectedLoadedPayroll);
  genderType = Gender;
  unit = DatetimeUnitEnum;
  payrollStay$ = this.store.pipe(select(selectorAllPayroll));
  salariesStay$ = this.store.pipe(select(selectorAllTemplate));
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
      payrollDTO: {
        take: this.pageSize,
        skip: this.pageIndex,
        createdAt: new Date(this.createdAt),
        salaryType: SalaryTypeEnum.STAY,
        filterType: FilterTypeEnum.SALARY
      }
    }));
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({ salaryType: SalaryTypeEnum.STAY }));
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { createdAt: new Date(value.createdAt) }));
        this.store.dispatch(PayrollAction.loadInit(
          {
            payrollDTO: this.mapPayrollStay()
          }
        ));
      }
    );

    this.payrollStay$.subscribe(payrolls => {
      this.salaries = [];
      payrolls.forEach(payroll => {
        if (payroll) {
          if (payroll.salaries) {
            payroll.salaries.forEach(salary => {
              if ((salary.type === SalaryTypeEnum.STAY)) {
                if (this.isSelectSalary && !this.salaryIds.includes(salary.id)
                  && !this.salaries.find(e => e.id === salary.id)) {
                  this.salaryIds.push(salary.id);
                }
                this.salaries.push(salary);
              }
            });
          }
        }
      });
    });
  }

  readPayroll(event: any) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', event.payrollId]).then();
  }

  addSalaryStay() {
    const ref = this.dialog.open(DialogStayComponent, {
      width: 'fit-content',
      data: {
        addMultiple: true,
        createdAt: this.formGroup.get('createdAt')!.value,
        type: SalaryTypeEnum.STAY
      }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('title')!.setValue(val.title, { emitEvent: false });
        this.store.dispatch((PayrollAction.loadInit({
          payrollDTO: {
            take: this.pageSize,
            skip: this.pageIndex,
            createdAt: this.formGroup.get('createdAt')!.value,
            salaryTitle: val.title,
            salaryType: SalaryTypeEnum.STAY,
            filterType: FilterTypeEnum.SALARY
          }
        })));
      }
    });
  }

  updateSalaryStay() {
    let salariesSelected: Salary[] = [];
    this.salaries.forEach(salary => {
      if (this.salaryIds.includes(salary.id)) {
        salariesSelected.push(salary);
      }
    });
    if (salariesSelected.every((value, index, array) => {
      return value.title === array[0].title;
    })) {
      const ref = this.dialog.open(DialogStayComponent, {
        width: 'fit-content',
        data: {
          isUpdate: true,
          salary: salariesSelected[0],
          salaryIds: this.salaryIds,
          updateMultiple: true
        }
      });
      ref.afterClosed().subscribe(
        val => {
          if (val) {
            this.isSelectSalary = false;
            this.salaryIds = [];
            const value = this.formGroup.value;
            this.formGroup.get('title')!.setValue(val.title,
              { emitEvent: false });
            this.store.dispatch(PayrollAction.loadInit({
              payrollDTO: {
                take: this.pageSize,
                skip: this.pageIndex,
                searchType: value.searchType,
                createdAt: new Date(value.createdAt),
                salaryTitle: val.title,
                name: value.name,
                salaryType: SalaryTypeEnum.STAY,
                filterType: FilterTypeEnum.SALARY
              }
            }));
          }
        }
      );
    } else {
      this.snackbar.open('chưa chọn cùng loại  lương', 'Đóng');
    }
  }

  deleteSalaryStay(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.snackbar.open('Xóa phiếu lương thành công', '', { duration: 1500 });
            this.store.dispatch(PayrollAction.loadInit(
              {
                payrollDTO: this.mapPayrollStay()
              }
            ));
          }
        });
      }
    });
  }

  onScroll() {
    const value = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(
      {
        payrollDTO: this.mapPayrollStay()
      }
    ));
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

  mapPayrollStay() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      searchType: value.searchType,
      createdAt: new Date(value.createdAt),
      salaryTitle: value.title ? value.title : '',
      name: value.name,
      salaryType: SalaryTypeEnum.STAY,
      filterType: FilterTypeEnum.SALARY
    };
    if (!value.name) {
      delete params.name;
    }
    return params;
  }
}
