import { DatePipe } from '@angular/common';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Api, SearchTypeConstant } from '@minhdu-fontend/constants';
import { Employee, Salary, SalaryPayroll } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  SalaryTypeEnum,
  SearchTypeEnum
} from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { UnitAbsentConstant } from '../../../../../../../../libs/constants/HR/unitAbsent.constant';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import {
  getAllPosition,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';
import {
  getFirstDayInMonth,
  getLastDayInMonth
} from '../../../../../../../../libs/utils/daytime.until';
import { getSelectors } from '../../../../../../../../libs/utils/getState.ultils';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { AppState } from '../../../../reducers';
import { SalaryService } from '../../service/salary.service';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { DialogAbsentComponent } from '../dialog-salary/dialog-absent/dialog-absent.component';
import { DialogTimekeepingComponent } from '../dialog-salary/timekeeping/dialog-timekeeping.component';
import { DialogExportComponent } from '../dialog-export/dialog-export.component';

@Component({
  selector: 'app-payroll-absent',
  templateUrl: 'payroll-absent.component.html'
})

export class PayrollAbsentComponent implements OnInit  {
  @Input() eventAddAbsent?: Subject<any>;
  @Input() eventExportAbsent?: Subject<boolean>;
  @Input() absentTitle?: string;
  @Input() createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
  pageType = PageTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  formGroup = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    unit: new FormControl(''),
    startedAt: new FormControl(
      this.datePipe.transform(getFirstDayInMonth(this.createdAt), 'yyyy-MM-dd')
    ),
    endedAt: new FormControl(
      this.datePipe.transform(getLastDayInMonth(this.createdAt), 'yyyy-MM-dd')
    ),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(getSelectors(selectedPositionPayroll, this.store)),
    branch: new FormControl(getSelectors(selectedBranchPayroll, this.store))
  });
  totalSalaryAbsent$ = this.store.select(selectedTotalPayroll);
  searchTypeConstant = SearchTypeConstant;
  loaded$ = this.store.select(selectedLoadedPayroll);
  genderType = Gender;
  unit = DatetimeUnitEnum;
  payrollAbsent$ = this.store.pipe(select(selectorAllPayroll));
  salariesSelected: SalaryPayroll[] = [];
  isSelectSalary = false;
  salaries: SalaryPayroll[] = [];
  pageSize = 30;
  pageIndex = 0;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  unitAbsent = UnitAbsentConstant;
  isEventSearch = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    let paramLoadInit = {
      take: this.pageSize,
      skip: this.pageIndex,
      salaryType: SalaryTypeEnum.ABSENT,
      filterType: FilterTypeEnum.SALARY,
      position: getSelectors<string>(selectedPositionPayroll, this.store),
      branch: getSelectors<string>(selectedBranchPayroll, this.store)
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
      Object.assign(paramLoadInit, {
        createdAt: this.datePipe.transform(this.createdAt, 'yyyy-MM-dd')
      });
    } else {
      Object.assign(paramLoadInit, {
        startedAt: getFirstDayInMonth(new Date(this.createdAt)),
        endedAt: getLastDayInMonth(new Date(this.createdAt))
      });
    }

    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: paramLoadInit
      })
    );

    if (this.absentTitle) {
      this.formGroup
        .get('title')!
        .setValue(this.absentTitle);
      this.formGroup
        .get('startedAt')!
        .setValue(
          this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM-dd')
        );
      this.formGroup
        .get('endedAt')!
        .setValue(
          this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM-dd')
        );
    }

    this.eventAddAbsent?.subscribe((val) => {
      this.formGroup.get('title')!.setValue(val.absentTitle);
      this.formGroup
        .get('startedAt')!
        .setValue(
          this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd')
        );
      this.formGroup
        .get('endedAt')!
        .setValue(
          this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd')
        );
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          createdAt: new Date(value.startedAt),
          position: value.position,
          branch: value.branch
        })
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollAbsent()
        })
      );
    });

    this.payrollAbsent$.subscribe((payrolls) => {
      if (payrolls) {
        this.salaries = [];
        if(payrolls.length === 0){
          this.isSelectSalary = false
        }
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (
                salary.type === SalaryTypeEnum.ABSENT ||
                salary.type === SalaryTypeEnum.DAY_OFF
              ) {
                if (this.isEventSearch) {
                  this.isSelectSalary = this.salariesSelected.length > 0
                    && this.salariesSelected.length >= Number(getSelectors(selectedTotalPayroll, this.store))
                   && this.salaries.every(item => this.salariesSelected.some(val => val.salary.id === item.salary.id));
                }
                if (
                  this.isSelectSalary &&
                  !this.salariesSelected.some(item => item.salary.id === salary.id) &&
                  !this.salaries.find((e) => e.salary.id === salary.id)
                ) {
                  this.salariesSelected.push({ salary: salary, employee: payroll.employee });
                }
                this.salaries.push({ salary: salary, employee: payroll.employee });
              }
            });
          }
        });
      }
    });

    this.eventExportAbsent?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollAbsent = {
          code: value.code || '',
          name: value.name,
          position: value.position,
          branch: value.branch,
          exportType: FilterTypeEnum.ALLOWANCE,
          title: value.title
        };
        if(value.startedAt && value.endedAt){
          if (
            moment(value.startedAt).format('YYYY-MM-DD') ===
            moment(value.endedAt).format('YYYY-MM-DD')
          ) {
            Object.assign(payrollAbsent, { createdAt: value.startedAt });
          } else {

            Object.assign(payrollAbsent, {
              startedAt: value.startedAt,
              endedAt: value.endedAt
            });
          }
        }
        const ref = this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuât bảng khấu trừ',
            exportType: FilterTypeEnum.ABSENT,
            params: payrollAbsent,
            api: Api.HR.PAYROLL.PAYROLL_EXPORT_OVERTIME
          }
        });
      }
    });
  }


  readPayroll(event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', event.payrollId])
      .then();
  }

  addSalaryAbsent() {
    const ref = this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('title')!.setValue(val.title);
        this.formGroup
          .get('startedAt')!
          .setValue(
            this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd')
          );
        this.formGroup
          .get('endedAt')!
          .setValue(
            this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd')
          );
      }
    });
  }

  updateMultipleSalaryAbsent() {
    const value = this.formGroup.value;
    if (
      this.salariesSelected.every((value, index, array) => {
        return value.salary.title === array[0].salary.title;
      })
    ) {
      const ref = this.dialog.open(DialogAbsentComponent, {
        width: 'fit-content',
        data: {
          isUpdate: true,
          salary: this.salariesSelected[0].salary,
          salariesSelected: this.salariesSelected,
          updateMultiple: true,
          createdAt: value.startedAt,
          type: SalaryTypeEnum.ABSENT
        }
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.isSelectSalary = this.salaries.length > 0
          && this.salaries.every(e => this.salariesSelected.some(item => item.salary.id === e.salary.id));
        this.ref.detectChanges()
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
          this.isSelectSalary = false;
          this.salariesSelected = [];
          this.formGroup.get('title')!.setValue(val.title);
          this.formGroup
            .get('startedAt')!
            .setValue(
              this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd')
            );
          this.formGroup
            .get('endedAt')!
            .setValue(
              this.datePipe.transform(new Date(val.datetime), 'yyyy-MM-dd')
            );
        }
      });
    } else {
      this.snackbar.open('chưa chọn cùng loại  lương', 'Đóng');
    }
  }

  deleteMultipleSalaryAbsent() {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        let deleteSuccess = new Subject<number>();
        this.salariesSelected.forEach((item, index) => {
          this.salaryService.delete(item.salary.id).subscribe((val: any) => {
            if (val) {
              deleteSuccess.next(index);
            }
          });
        });
        deleteSuccess.subscribe((val) => {
          if (val === this.salariesSelected.length - 1) {
            this.isSelectSalary = false;
            this.salariesSelected = [];
            this.snackbar.open('Xóa khấu trừ thành công', '', {
              duration: 1500
            });
            this.store.dispatch(
              PayrollAction.loadInit({ payrollDTO: this.mapPayrollAbsent() })
            );
          }
        });
      }
    });
  }

  deleteSalaryAbsent(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.store.dispatch(
              PayrollAction.loadInit({
                payrollDTO: this.mapPayrollAbsent()
              })
            );
            this.snackbar.open('Xóa phiếu lương thành công', '', {
              duration: 1500
            });
          }
        });
      }
    });
  }

  onScroll() {
    this.isEventSearch = false;
    const value = this.formGroup.value;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollAbsent()
      })
    );
  }

  updateSelectSalary(salary: Salary, employee: Employee) {
    const salarySelected = { salary, employee };
    this.isSelectSalary = updateSelect(
      salarySelected,
      this.salariesSelected,
      this.isSelectSalary,
      this.salaries
    );
  }

  someCompleteSalary(): boolean {
    return someComplete(this.salaries, this.salariesSelected, this.isSelectSalary);
  }

  setAllSalary(select: boolean) {
    this.isSelectSalary = setAll(select, this.salaries, this.salariesSelected);
  }

  mapPayrollAbsent() {
    const value = this.formGroup.value;
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
    if (
      moment(value.startedAt).format('YYYY-MM-DD') ===
      moment(value.endedAt).format('YYYY-MM-DD')
    ) {
      Object.assign(params, { createdAt: value.startedAt });
    } else {
      Object.assign(params, {
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

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  selectSalary(salary: Salary) {
    return this.salariesSelected.some((e) => e.salary.id === salary.id);
  }
}
