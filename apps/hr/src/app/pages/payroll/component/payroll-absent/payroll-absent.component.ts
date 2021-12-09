import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DatetimeUnitEnum, FilterTypeEnum, Gender, SalaryTypeEnum, SearchTypeEnum } from '@minhdu-fontend/enums';
import { SearchTypeConstant, UnitsConstant } from '@minhdu-fontend/constants';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { debounceTime, startWith } from 'rxjs/operators';
import { Salary } from '@minhdu-fontend/data-models';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { SalaryService } from '../../service/salary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll, selectedPositionPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { Router } from '@angular/router';
import { getState } from '../../../../../../../../libs/utils/getState.ultils';
import { DialogAbsentComponent } from '../dialog-salary/dialog-absent/dialog-absent.component';
import { DialogTimekeepingComponent } from '../dialog-salary/timekeeping/dialog-timekeeping.component';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../libs/utils/daytime.until';
import * as moment from 'moment';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { UnitAbsentConstant } from '../../../../../../../../libs/constants/unitAbsent.constant';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';

@Component({
  selector: 'app-payroll-absent',
  templateUrl: 'payroll-absent.component.html'
})
export class PayrollAbsentComponent implements OnInit {
  @Input() eventAddAbsent?: Subject<any>;
  @Input() eventExportAbsent?: Subject<boolean>;
  @Input() absentTitle?: string;
  pageType = PageTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  createdAt = getState(selectedCreateAtPayroll, this.store);
  formGroup = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    unit: new FormControl(''),
    startedAt: new FormControl(this.datePipe.transform(
      getFirstDayInMonth(this.createdAt), 'yyyy-MM-dd')),
    endedAt: new FormControl(this.datePipe.transform(
      getLastDayInMonth(this.createdAt), 'yyyy-MM-dd')),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(getState(selectedPositionPayroll, this.store)),
    branch: new FormControl(getState(selectedBranchPayroll, this.store))
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
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  unitAbsent = UnitAbsentConstant;
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
    let paramLoadInit = {
      take: this.pageSize,
      skip: this.pageIndex,
      salaryTitle: this.absentTitle ? this.absentTitle : '',
      salaryType: SalaryTypeEnum.ABSENT,
      filterType: FilterTypeEnum.SALARY,
      position: getState(selectedPositionPayroll, this.store),
      branch: getState(selectedBranchPayroll, this.store)
    };

    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );

    if (this.absentTitle) {
      Object.assign(paramLoadInit, { createdAt: new Date(this.createdAt) });
    } else {
      Object.assign(paramLoadInit, {
        startedAt: getFirstDayInMonth(new Date(this.createdAt)),
        endedAt: getLastDayInMonth(new Date(this.createdAt))
      });
    }
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO: paramLoadInit
    }));

    if (this.absentTitle) {
      this.formGroup.get('title')!.setValue(this.absentTitle, { emitEvent: false });
    }

    this.eventAddAbsent?.subscribe(val => {
      this.formGroup.get('title')!.setValue(val.absentTitle);
      this.formGroup.get('startedAt')!.setValue(
        this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd'));
      this.formGroup.get('endedAt')!.setValue(
        this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd'));
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { createdAt: new Date(value.startedAt), position: value.position, branch: value.branch }));
        this.store.dispatch(PayrollAction.loadInit(
          {
            payrollDTO: this.mapPayrollAbsent()
          }
        ));
      }
    );

    this.payrollAbsent$.subscribe(payrolls => {
      if (payrolls) {
        this.salaries = [];
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

    this.eventExportAbsent?.subscribe(val => {
      if (val) {
        //export Absent
      }
    });
    console.log(this.salaries);
  }

  readPayroll(event: any) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', event.payrollId]).then();
  }

  addSalaryAbsent() {
    const ref = this.dialog.open(DialogTimekeepingComponent,
      {
        width: 'fit-content'
      }
    );
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('title')!.setValue(val.title);
        this.formGroup.get('startedAt')!.setValue(
          this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd'));
        this.formGroup.get('endedAt')!.setValue(
          this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd'));
      }
    });
  }

  updateMultipleSalaryAbsent() {
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
          createdAt: value.startedAt,
          type: SalaryTypeEnum.ABSENT
        }
      });
      ref.afterClosed().subscribe(
        val => {
          if (val) {
            this.isSelectSalary = false;
            this.salaryIds = [];
            this.formGroup.get('title')!.setValue(val.title);
            this.formGroup.get('startedAt')!.setValue(
              this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd'));
            this.formGroup.get('endedAt')!.setValue(
              this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd'));
          }
        }
      );
    } else {
      this.snackbar.open('chưa chọn cùng loại  lương', 'Đóng');
    }
  }

  deleteMultipleSalaryAbsent() {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        let deleteSuccess = new Subject<number>();
        this.salaryIds.forEach((id, index) => {
          this.salaryService.delete(id).subscribe(
            (val: any) => {
              if (val) {
                deleteSuccess.next(index);
              }
            }
          );
        });
        deleteSuccess.subscribe(val => {
          if (val === this.salaryIds.length - 1) {
            this.isSelectSalary = false;
            this.salaryIds = [];
            this.snackbar.open('Xóa khấu trừ thành công', '', { duration: 1500 });
            this.store.dispatch(PayrollAction.loadInit({ payrollDTO: this.mapPayrollAbsent() }));
          }
        });
      }
    });
  }

  deleteSalaryAbsent(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.store.dispatch(PayrollAction.loadInit(
              {
                payrollDTO: this.mapPayrollAbsent()
              }
            ));
            this.snackbar.open('Xóa phiếu lương thành công', '', { duration: 1500 });
          }
        });
      }
    });
  }

  onScroll() {
    const value = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(
      {
        payrollDTO: this.mapPayrollAbsent()
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

  mapPayrollAbsent() {
    const value = this.formGroup.value;
    console.log(new Date(value.startedAt).toUTCString());
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      code: value.code,
      searchType: value.searchType,
      salaryTitle: value.title ? value.title : '',
      name: value.name,
      unit: value.unit,
      salaryType: SalaryTypeEnum.ABSENT,
      filterType: FilterTypeEnum.SALARY,
      position: value.position,
      branch: value.branch
    };
    if (moment(value.startedAt).format('YYYY-MM-DD')
      === moment(value.endedAt).format('YYYY-MM-DD')) {
      Object.assign(params, { createdAt: value.startedAt });
    } else {
      Object.assign(params,
        {
          startedAt: value.startedAt,
          endedAt: value.endedAt
        });
    }
    if (!value.name) {
      delete params.name;
    }
    return params;
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }


  checkInputNumber(event: any){
    return checkInputNumber(event)
  }
}
