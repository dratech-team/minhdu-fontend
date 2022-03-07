import {DatePipe} from '@angular/common';
import {AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Api, PayrollConstant} from '@minhdu-fontend/constants';
import {EmployeeAction} from '@minhdu-fontend/employee';
import {EmployeeType, FilterTypeEnum, ItemContextMenu, SalaryTypeEnum, sortTypeEnum} from '@minhdu-fontend/enums';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {select, Store} from '@ngrx/store';
import {of, Subject} from 'rxjs';
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedTotalPayroll,
  selectedTypePayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {checkInputNumber, getSelectors, rageDaysInMonth, searchAutocomplete} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {AddPayrollComponent} from '../../component/add-Payroll/add-payroll.component';
import {
  DialogAllowanceMultipleComponent
} from '../../component/dialog-salary/dialog-allowance-multiple/dialog-allowance-multiple.component';
import {
  DialogOvertimeMultipleComponent
} from '../../component/dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import {DialogTimekeepingComponent} from '../../component/dialog-salary/timekeeping/dialog-timekeeping.component';
import {SelectAddMultiple} from '../../component/dialog-select-add-multiple/select-add-multiple';
import {SelectUpdateMultiple} from '../../component/dialog-select-update-multiple/select-update-multiple';
import {RestorePayrollComponent} from '../../component/restore-payroll/restore-payroll.component';
import {UpdateConfirmComponent} from '../../component/update-comfirm/update-confirm.component';
import {Payroll} from '../../+state/payroll/payroll.interface';
import {Category} from "@minhdu-fontend/data-models";
import {DialogCategoryComponent} from "../../../employee/components/category/dialog-category.component";
import {CategoryService} from "../../../../../../../../libs/employee/src/lib/+state/service/category.service";
import {MatSort, Sort} from "@angular/material/sort";
import {values} from "lodash";

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatSort) sort!: MatSort;
  categoryControl = new FormControl('')
  formGroup = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(
      this.datePipe.transform(
        getSelectors<Date>(selectedCreateAtPayroll, this.store),
        'yyyy-MM'
      )
    ),
    position: new FormControl(
      getSelectors<string>(selectedPositionPayroll, this.store)
    ),
    branch: new FormControl(
      getSelectors<string>(selectedBranchPayroll, this.store)
    )
  });
  selectPayroll = new FormControl(
    getSelectors<FilterTypeEnum>(selectedTypePayroll, this.store)
  );
  selectedPayroll: FilterTypeEnum = getSelectors<FilterTypeEnum>(
    selectedTypePayroll,
    this.store
  );
  branchName = getSelectors<string>(selectedBranchPayroll, this.store);
  positionName = getSelectors<string>(selectedPositionPayroll, this.store);
  salaryType = SalaryTypeEnum;
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageSize = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  total$ = this.store.pipe(select(selectedTotalPayroll));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  code?: string;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
  overtimeTitle?: string;
  allowanceTitle?: string;
  absentTitle?: string;
  ItemContextMenu = ItemContextMenu;
  daysInMonth: any[] = [];
  payrollConstant = PayrollConstant;
  filterTypeEnum = FilterTypeEnum;
  private stop$ = new Subject<void>();
  eventAddOvertime = new Subject<any>();
  eventAddAllowance = new Subject<any>();
  eventAddAbsent = new Subject<any>();
  eventExportOvertime = new Subject<boolean>();
  eventExportAbsent = new Subject<boolean>();
  eventExportBasic = new Subject<boolean>();
  eventExportStay = new Subject<boolean>();
  eventExportAllowance = new Subject<boolean>();
  categories$ = this.categoryService.getAll()
  sortEnum = sortTypeEnum;


  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private ref: ChangeDetectorRef,
    private readonly categoryService: CategoryService,
  ) {
  }

  ngOnInit() {
    this.loadInitPayroll();

    this.daysInMonth = rageDaysInMonth(this.createdAt);

    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.selectPayroll.valueChanges.pipe().subscribe((val) => {
      if (val === FilterTypeEnum.TIME_SHEET && !this.createdAt) {
        this.selectedPayroll = val;
        this.formGroup.get('createdAt')?.reset();
        this.createdAt = new Date();
        this.daysInMonth = rageDaysInMonth(new Date());
        this.store.dispatch(
          PayrollAction.updateStatePayroll({
            filter: val,
            createdAt: new Date()
          })
        );
      } else {
        if (
          val === FilterTypeEnum.PAYROLL ||
          val === FilterTypeEnum.TIME_SHEET
        ) {
          this.positionName = getSelectors(selectedPositionPayroll, this.store);
          this.branchName = getSelectors(selectedBranchPayroll, this.store);
          this.formGroup.get('position')?.setValue(this.positionName, {emitEvent: false});
          this.formGroup.get('branch')?.setValue(this.branchName, {emitEvent: false});
        }
        this.selectedPayroll = val;
        this.store.dispatch(PayrollAction.updateStatePayroll({filter: val}));
      }
      if (
        val !== FilterTypeEnum.STAY &&
        val !== FilterTypeEnum.BASIC &&
        val !== FilterTypeEnum.ALLOWANCE &&
        val !== FilterTypeEnum.ABSENT
      ) {
        this.formGroup.get('createdAt')?.setValue(
          this.datePipe.transform(
            getSelectors(selectedCreateAtPayroll, this.store),
            'yyyy-MM'
          ),
          {emitEvent: false}
        );
        return this.loadInitPayroll();
      }
    });

    this.formGroup.valueChanges
      .pipe(
        map((val) => {
          if (
            !val.createdAt &&
            this.selectedPayroll === FilterTypeEnum.TIME_SHEET
          ) {
            this.snackbar.open('Phiếu chấm công phải chọn tháng', 'Đóng');
            this.formGroup.get('createdAt')?.patchValue(this.datePipe.transform(new Date(), 'yyyy-MM'));
            takeUntil(this.stop$);
          } else {
            return val;
          }
        })
      )
      .pipe(debounceTime(1500))
      .subscribe((val) => {
        if (val) {
          this.branchName = val?.branch;
          this.positionName = val?.position;
          this.createdAt = val?.createdAt;
          this.daysInMonth = rageDaysInMonth(new Date(val.createdAt));
          this.store.dispatch(
            PayrollAction.updateStatePayroll({
              createdAt: new Date(val.createdAt) || new Date(val.createdAt),
              branch: val.branch,
              position: val.position
            })
          );
          return this.loadInitPayroll();
        }
      });

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );

    this.categoryControl.valueChanges.subscribe(val =>{
      if(val!== 0){
        this.loadInitPayroll()
      }
    })
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  loadInitPayroll() {
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: this.mapPayroll(this.formGroup.value)
      })
    );
  }

  mapPayroll(val: any) {
    const payroll = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      categoryId: this.categoryControl.value !== 0 ? this.categoryControl.value : '',
      code: val.code,
      name: val.name,
      position: this.positionName,
      branch: this.branchName,
      createdAt: getSelectors<Date>(selectedCreateAtPayroll, this.store),
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt,
      filterType: this.selectedPayroll,
      employeeType:
        this.selectedPayroll === FilterTypeEnum.SEASONAL
          ? EmployeeType.EMPLOYEE_SEASONAL
          : EmployeeType.EMPLOYEE_FULL_TIME,

    };
    if(this.sort.active){
      Object.assign(payroll, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction === 'asc' ? 'UP' : 'DOWN' : '',
      })
    }
    return payroll
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayroll(val)
      })
    );
  }

  addPayroll($event?: any): void {
    const ref = this.dialog
      .open(AddPayrollComponent, {
        width: '30%',
        data: {employeeId: $event?.employee?.id, addOne: true}
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.formGroup.get('createdAt')?.patchValue(this.datePipe.transform(val, 'yyyy-MM'));
        }
      });
  }

  updateConfirmPayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: {id, type}
    });
  }

  addSalaryOvertime(type: SalaryTypeEnum): any {
    this.dialog
      .open(DialogOvertimeMultipleComponent, {
        width: 'fit-content',
        data: {
          createdAt: this.createdAt,
          type: type,
          isTimesheet: this.selectedPayroll === FilterTypeEnum.TIME_SHEET
        }
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.createdAt = new Date(val.datetime);
          this.overtimeTitle = val.title;
          this.store.dispatch(
            PayrollAction.updateStatePayroll({
              createdAt: new Date(val.datetime)
            })
          );
          this.eventAddOvertime.next({
            createdAt: new Date(val.datetime),
            overtimeTitle: val.title
          });
          this.selectPayroll.setValue(FilterTypeEnum.OVERTIME);
        }
      });
  }

  addSalaryAllowance() {
    this.dialog
      .open(DialogAllowanceMultipleComponent, {
        width: 'fit-content',
        data: {
          createdAt: this.createdAt,
          isTimesheet: this.selectedPayroll === FilterTypeEnum.TIME_SHEET
        }
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this.createdAt = new Date(value.datetime);
          this.allowanceTitle = value.title;
          this.store.dispatch(
            PayrollAction.updateStatePayroll({
              createdAt: new Date(value.datetime)
            })
          );
          this.selectPayroll.setValue(FilterTypeEnum.ALLOWANCE);
          this.eventAddAllowance.next({
            allowanceTitle: value.title
          });
        }
      });
  }

  timekeeping() {
    this.store.dispatch(EmployeeAction.loadInit({employee: {}}));
    const ref = this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content',
      data: {
        createdAt: this.createdAt,
        isTimesheet: this.selectedPayroll === FilterTypeEnum.TIME_SHEET
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.createdAt = new Date(val.datetime);
        this.absentTitle = val.title;
        this.store.dispatch(
          PayrollAction.updateStatePayroll({
            createdAt: new Date(val.datetime)
          })
        );
        this.eventAddAbsent.next({
          datetime: val.datetime,
          absentTitle: val.title
        });
        this.selectPayroll.setValue(FilterTypeEnum.ABSENT);
      }
    });
  }

  updatePayroll($event: any) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id], {
      queryParams: {
        isUpdate: true
      }
    }).then();
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }

  generate() {
    const ref = this.dialog.open(AddPayrollComponent, {
      width: '30%',
      data: {
        employeeType:
          this.selectedPayroll === FilterTypeEnum.SEASONAL
            ? EmployeeType.EMPLOYEE_SEASONAL
            : ''
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('createdAt')?.patchValue(this.datePipe.transform(val, 'yyyy-MM'));
      }
    });
  }

  selectMonth(event: any) {
    this.createdAt = event;
    this.formGroup.get('createdAt')?.patchValue(this.datePipe.transform(event, 'yyyy-MM'));
  }

  restorePayroll(payroll: Payroll) {
    this.dialog.open(RestorePayrollComponent, {
      width: 'fit-content',
      data: {payroll: payroll}
    });
  }

  deletePayroll(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          PayrollAction.deletePayroll({
            id: event.id
          })
        );
      }
    });
  }

  historyPayroll(event: any) {
    this.router
      .navigate(['phieu-luong/lich-su-luong', event.employee.id], {
        queryParams: {
          name: event.employee.lastName,
          employeeType: event.employee.type
        }
      })
      .then();
  }

  openDialogAddMultiple() {
    const ref = this.dialog.open(SelectAddMultiple, {width: 'fit-content'});
    ref.afterClosed().subscribe((val) => {
      if (val) {
        switch (val) {
          case SalaryTypeEnum.OVERTIME:
            this.addSalaryOvertime(val);
            break;
          case SalaryTypeEnum.ALLOWANCE:
            this.addSalaryAllowance();
            break;
          case SalaryTypeEnum.ABSENT:
            this.timekeeping();
            break;
        }
      }
    });
  }

  openDialogExportMultiple() {
    this.dialog
      .open(SelectUpdateMultiple, {
        width: 'fit-content',
        data: {
          pageType: this.selectedPayroll
        }
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          switch (val) {
            case FilterTypeEnum.BASIC:
              this.eventExportBasic.next(true);
              break;
            case FilterTypeEnum.OVERTIME:
              this.eventExportOvertime.next(true);
              break;
            case FilterTypeEnum.ALLOWANCE:
              this.eventExportAllowance.next(true);
              break;
            case FilterTypeEnum.ABSENT:
              this.eventExportAbsent.next(true);
              break;
            case FilterTypeEnum.STAY:
              this.eventExportStay.next(true);
              break;
            case FilterTypeEnum.TIME_SHEET:
              this.exportTimeSheet();
              break;
            case FilterTypeEnum.SEASONAL:
              this.eventExportAbsent.next(true);
              break;
            case FilterTypeEnum.PAYROLL:
              this.exportPayroll();
              break;
          }
        }
      });
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }


  exportPayroll() {
    const value = this.formGroup.value;
    const payroll = {
      code: value.code || '',
      name: value.name,
      position: value.position,
      branch: value.branch,
      paidAt: value.paidAt,
      accConfirmedAt: value.accConfirmedAt,
      exportType: FilterTypeEnum.PAYROLL
    };
    if (value.createdAt) {
      Object.assign(payroll, {createdAt: new Date(value.createdAt)});
    }
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xuât bảng lương',
        exportType: FilterTypeEnum.PAYROLL,
        params: payroll,
        isPayroll: true,
        api: Api.HR.PAYROLL.EXPORT
      }
    });
  }

  exportTimeSheet() {
    const value = this.formGroup.value;
    const payroll = {
      code: value.code || '',
      name: value.name,
      position: value.position,
      branch: value.branch,
      exportType: FilterTypeEnum.TIME_SHEET
    };
    if (value.createdAt) {
      Object.assign(payroll, {createdAt: new Date(value.createdAt)});
    }
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xuât bảng chấm công',
        exportType: FilterTypeEnum.TIME_SHEET,
        params: payroll,
        isPayroll: true,
        api: Api.HR.PAYROLL.EXPORT
      }
    });
  }

  addCategory() {
    this.dialog.open(DialogCategoryComponent, {width: 'fit-content'}).afterClosed()
      .subscribe(() => this.categories$ = this.categoryService.getAll())
  }

  updateCategory():any {
    if(this.categoryControl.value === 0 || !this.categoryControl.value){
      return this.snackbar.open('Chưa chọn danh mục để sửa','',{duration:1500})
    }
    this.dialog.open(DialogCategoryComponent, {
      width: 'fit-content',
      data: {categoryId: this.categoryControl.value, isUpdate: true}
    })
      .afterClosed().subscribe(() => {
      this.categories$ = this.categoryService.getAll();
    });
  }

  sortPayroll(sort?: MatSort) {
    if(sort){
      this.sort = sort
    }
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO : this.mapPayroll(this.formGroup.value)
    }))
  }


}
