import {DatePipe} from '@angular/common';
import {AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {ActivatedRoute, Router} from '@angular/router';
import {Api, EmployeeStatusConstant, PayrollConstant} from '@minhdu-fontend/constants';
import {
  EmployeeType,
  FilterTypeEnum,
  ItemContextMenu,
  SalaryTypeEnum,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {debounceTime, map, takeUntil} from 'rxjs/operators';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedRangeDayPayroll,
  selectedTotalPayroll,
  selectedTypePayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {
  checkInputNumber,
  getFirstDayInMonth,
  getLastDayInMonth,
  getSelectors,
  rageDaysInMonth
} from '@minhdu-fontend/utils';
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
import {DialogCategoryComponent} from '../../../employee/components/category/dialog-category.component';
import {CategoryService} from '../../../../../../../../libs/employee/src/lib/+state/service/category.service';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Branch, Category, Position, RangeDay} from "@minhdu-fontend/data-models";
import {Role} from "../../../../../../../../libs/enums/hr/role.enum";
import {ExportService} from "@minhdu-fontend/service";
import {ConfirmPayrollComponent} from "../../component/confirm-payroll/confirm-payroll.component";
import { EmployeeStatusEnum } from '../../../../../../../../libs/enums/hr/employee-status.enum';

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatSort) sort!: MatSort;
  categoryControl = new FormControl('');
  formEmpStatus = new FormControl(EmployeeStatusEnum.IS_ACTIVE)
  formGroup = new FormGroup({
    accConfirmed: new FormControl(-1),
    name: new FormControl(''),
    code: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    position: new FormControl(
      getSelectors<string>(selectedPositionPayroll, this.store)
    ),
  });
  selectPayroll = new FormControl(
    getSelectors<FilterTypeEnum>(selectedTypePayroll, this.store)
  );
  selectedPayroll: FilterTypeEnum = getSelectors<FilterTypeEnum>(
    selectedTypePayroll,
    this.store
  );
  formCtrlBranch = new FormControl(getSelectors<Branch>(selectedBranchPayroll, this.store))
  salaryType = SalaryTypeEnum;
  contextMenu!: MatMenuTrigger;
  pageSize = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  total$ = this.store.pipe(select(selectedTotalPayroll));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  code?: string;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart)).pipe(map(branches => {
    if (branches.length === 1) {
      this.store.dispatch(PayrollAction.updateStateBranch({
        branch: branches[0]
      }))
      this.categories$ = this.categoryService.getAll({branch: branches[0].name})
      this.formCtrlBranch.patchValue(branches[0], {emitEvent: false})
    }
    return branches
  }));
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
  categories$ = new Observable<Category[]>();
  sortEnum = sortEmployeeTypeEnum;
  role!: string | null
  roleEnum = Role
  searchBranchOvertime?: Branch;
  searchBranchBasic?: Branch;
  searchBranchAllowance?: Branch;
  searchBranchStay?: Branch;
  searchBranchAbsent?: Branch;
  selectEmpStatusOvertime?: number
  selectEmpStatusAbsent?: number
  selectEmpStatusBasic?: number
  selectEmpStatusAllowance?: number
  selectEmpStatusStay?: number
  formCreatedAt = new FormControl(this.getRangeDay().start)
  formRangeDay = new FormControl([
    this.getRangeDay().start,
    this.getRangeDay().end,
  ])
  pickRangeDayOvertime = new Subject<boolean>();
  pickRangeDayAbsent = new Subject<boolean>();
  pickRangeDayAllowance = new Subject<boolean>();
  pickRangeDayStay = new Subject<boolean>();
  pickRangeDayBasic = new Subject<boolean>();
  empStatusContain = EmployeeStatusConstant;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1 == o2.type : o1.type === o2.type);


  constructor(
    private readonly message: NzMessageService,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private ref: ChangeDetectorRef,
    private readonly categoryService: CategoryService,
    private readonly activeRouter: ActivatedRoute,
    private readonly exportService: ExportService,
  ) {
  }

  ngOnInit() {
    this.role = window.localStorage.getItem('role')
    this.activeRouter.queryParams.subscribe((val) => {
      if (!val.titleOvertime) {
        this.loadInitPayroll();
      }
    });
    this.daysInMonth = rageDaysInMonth(new Date(this.formRangeDay.value[0]));
    this.store.dispatch(OrgchartActions.init());

    this.selectPayroll.valueChanges.pipe().subscribe((val) => {
      if (val === FilterTypeEnum.TIME_SHEET && this.formRangeDay.value?.length === 0) {
        this.selectedPayroll = val;
        this.formRangeDay.reset();
        this.store.dispatch(
          PayrollAction.updateStatePayroll({
            filter: val,
          })
        );
      } else {
        if (
          val === FilterTypeEnum.PAYROLL ||
          val === FilterTypeEnum.TIME_SHEET
        ) {
          this.formGroup.get('position')?.setValue(getSelectors<Position>(selectedPositionPayroll, this.store), {emitEvent: false});
          this.formCtrlBranch.setValue(getSelectors<string>(selectedBranchPayroll, this.store),
            {emitEvent: false});
        }
        this.selectedPayroll = val;
        this.store.dispatch(PayrollAction.updateStatePayroll({filter: val}));
      }
      if (
        val === FilterTypeEnum.PAYROLL ||
        val === FilterTypeEnum.TIME_SHEET ||
        val === FilterTypeEnum.SEASONAL
      ) {
        return this.loadInitPayroll();
      }
    });

    this.formGroup.valueChanges
      .pipe(
        map((val) => {
          if (
            !this.formCreatedAt.value &&
            this.selectedPayroll === FilterTypeEnum.TIME_SHEET
          ) {
            this.message.error('Phiếu chấm công phải chọn tháng');
            this.formCreatedAt.patchValue(this.datePipe.transform(new Date(), 'yyyy-MM'));
            takeUntil(this.stop$);
          } else {
            return val;
          }
        })
      )
      .pipe(debounceTime(1500))
      .subscribe((val) => {
        if (val) {
          this.store.dispatch(PayrollAction.updateStatePosition({position: val.position}));
          return this.loadInitPayroll();
        }
      });

    this.categoryControl.valueChanges.subscribe(val => {
      if (val !== 0) {
        this.loadInitPayroll();
      } else {
        this.addCategory()
      }
    });

    this.formEmpStatus.valueChanges.subscribe(empStatus => {
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          empStatus: empStatus,
        })
      );
      switch (this.selectPayroll.value) {
        case FilterTypeEnum.ABSENT:
          this.selectEmpStatusAbsent = empStatus
          break;
        case FilterTypeEnum.BASIC:
          this.selectEmpStatusBasic = empStatus
          break;
        case FilterTypeEnum.STAY:
          this.selectEmpStatusStay = empStatus
          break;
        case FilterTypeEnum.OVERTIME:
          this.selectEmpStatusOvertime = empStatus
          break;
        case FilterTypeEnum.ALLOWANCE:
          this.selectEmpStatusAllowance = empStatus
          break;
        default :
          this.store.dispatch(PayrollAction.loadInit({
            payrollDTO: this.mapPayroll(this.formGroup.value)
          }))
      }
    })
    this.formCreatedAt.valueChanges.subscribe(date => {
      this.store.dispatch(PayrollAction.updateStatePayroll({
        rangeDay: {
          start: getFirstDayInMonth(new Date(date)),
          end: getLastDayInMonth(new Date(date))
        }
      }))
      switch (this.selectPayroll.value) {
        case FilterTypeEnum.BASIC:
          this.pickRangeDayBasic.next(true)
          break;
        case FilterTypeEnum.STAY:
          this.pickRangeDayStay.next(true)
          break;
        case FilterTypeEnum.ALLOWANCE:
          this.pickRangeDayAllowance.next(true)
          break;
        default:
          this.daysInMonth = rageDaysInMonth(new Date(date));
          this.store.dispatch(PayrollAction.loadInit({
            payrollDTO: this.mapPayroll(this.formGroup.value)
          }))
      }
    })

    this.formRangeDay.valueChanges.subscribe(rangeDay => {
      this.daysInMonth = rageDaysInMonth(new Date(rangeDay[0]))
      this.store.dispatch(PayrollAction.updateStatePayroll({
        rangeDay: {
          start: rangeDay[0],
          end: rangeDay[1],
        }
      }))
      switch (this.selectPayroll.value) {
        case FilterTypeEnum.ABSENT:
          this.pickRangeDayAbsent.next(true)
          break;
        case FilterTypeEnum.OVERTIME:
          this.pickRangeDayOvertime.next(true)
          break;
      }
    })

    this.store.select(selectedRangeDayPayroll).subscribe(val => {
      this.formRangeDay.setValue([val.start, val.end], {emitEvent: false})
      this.formCreatedAt.setValue(val.start, {emitEvent: false})
    })


    this.formCtrlBranch.valueChanges.pipe().subscribe(branch => {
      if (branch) {
        this.store.dispatch(OrgchartActions.getBranch({id: branch.id}))
      }
      this.store.dispatch(PayrollAction.updateStateBranch({
        branch: branch
      }))
      switch (this.selectPayroll.value) {
        case FilterTypeEnum.ABSENT:
          this.searchBranchAbsent = branch
          break;
        case FilterTypeEnum.BASIC:
          this.searchBranchBasic = branch
          break;
        case FilterTypeEnum.STAY:
          this.searchBranchStay = branch
          break;
        case FilterTypeEnum.OVERTIME:
          this.searchBranchOvertime = branch
          break;
        case FilterTypeEnum.ALLOWANCE:
          this.searchBranchAllowance = branch
          break;
        default :
          this.store.dispatch(PayrollAction.loadInit({
            payrollDTO: this.mapPayroll(this.formGroup.value)
          }))
      }
      this.categories$ = this.categoryService.getAll({branch: branch})
    })
  }

  onChange(event: any){
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
      position: val.position?.name || '',
      branch: this.formCtrlBranch.value?.name || '',
      startedAt: getFirstDayInMonth(new Date(this.formCreatedAt.value)),
      endedAt: getLastDayInMonth(new Date(this.formCreatedAt.value)),
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt,
      filterType: this.selectedPayroll,
      empStatus: this.formEmpStatus.value,
      accConfirmed: val.accConfirmed,
      employeeType:
        this.selectedPayroll === FilterTypeEnum.SEASONAL
          ? EmployeeType.EMPLOYEE_SEASONAL
          : EmployeeType.EMPLOYEE_FULL_TIME

    };
    if (this.sort?.active) {
      Object.assign(payroll, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    return payroll;
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
    this.dialog
      .open(AddPayrollComponent, {
        width: '30%',
        data: {employeeId: $event?.employee?.id, addOne: true}
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.formRangeDay.patchValue([
            getFirstDayInMonth(new Date(val)),
            getLastDayInMonth(new Date(val)),
          ])
          this.store.dispatch(PayrollAction.loadInit({payrollDTO: this.mapPayroll(this.formGroup.value)}
          ))
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
          createdAt: this.formRangeDay.value[0],
          type: type,
          isTimesheet: this.selectedPayroll === FilterTypeEnum.TIME_SHEET
        }
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.overtimeTitle = val.title;
          this.store.dispatch(
            PayrollAction.updateStatePayroll({
              rangeDay: {
                start: new Date(val.datetime),
                end: new Date(val.datetime),
              }
            })
          );
          this.eventAddOvertime.next({
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
          createdAt: this.formRangeDay.value[0],
          isTimesheet: this.selectedPayroll === FilterTypeEnum.TIME_SHEET
        }
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this.allowanceTitle = value.title;
          this.selectPayroll.setValue(FilterTypeEnum.ALLOWANCE);
          this.eventAddAllowance.next({
            allowanceTitle: value.title
          });
        }
      });
  }

  timekeeping() {
    const ref = this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content',
      data: {
        createdAt: this.formRangeDay.value[0],
        isTimesheet: this.selectedPayroll === FilterTypeEnum.TIME_SHEET
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.absentTitle = val.title;
        this.store.dispatch(
          PayrollAction.updateStatePayroll({
            rangeDay: {
              start: new Date(val.datetime),
              end: new Date(val.datetime),
            }
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

  generate() {
    this.dialog.open(AddPayrollComponent, {
      width: '30%',
      data: {
        employeeType:
          this.selectedPayroll === FilterTypeEnum.SEASONAL
            ? EmployeeType.EMPLOYEE_SEASONAL
            : ''
      }
    }).afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(PayrollAction.updateStatePayroll({
          rangeDay: {
            start: getFirstDayInMonth(new Date(val)),
            end: getLastDayInMonth(new Date(val)),
          }
        }))
        this.store.dispatch(PayrollAction.loadInit({
          payrollDTO: this.mapPayroll(this.formGroup.value)
        }))
      }
    });
  }

  restorePayroll(payroll: Payroll) {
    this.dialog.open(RestorePayrollComponent, {
      width: 'fit-content',
      data: {payroll: payroll}
    });
  }

  confirmPayroll(payroll: Payroll) {
    this.dialog.open(ConfirmPayrollComponent, {
      width: 'fit-content',
      data: {
        payroll: payroll
      }
    });
  }

  deletePayroll(event: any) {
    this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    }).afterClosed().subscribe((val) => {
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
    this.router.navigate(['phieu-luong/lich-su-luong', event.employee.id], {
      queryParams: {
        name: event.employee.lastName,
        employeeType: event.employee.type
      }
    }).then();
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
              this.exportSeasonal()
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
      paidAt: value.paidAt,
      accConfirmedAt: value.accConfirmedAt,
      exportType: FilterTypeEnum.PAYROLL,
      empStatus: this.formEmpStatus.value,
      categoryId: this.categoryControl.value !== 0 ? this.categoryControl.value : '',
      position: value.position?.name || '',
      branch: this.formCtrlBranch.value?.name || '',
      startedAt: this.formRangeDay.value[0],
      endedAt: this.formRangeDay.value[1],
      isPaid: value.paidAt,
      isConfirm: value.accConfirmedAt,
      filterType: this.selectedPayroll,
      accConfirmed: value.accConfirmed,
      employeeType: EmployeeType.EMPLOYEE_FULL_TIME
    };
    if (this.sort?.active) {
      Object.assign(payroll, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        filename: `Xuất bảng lương từ ngày ${this.datePipe.transform(this.formRangeDay.value[0], 'dd-MM-yyyy')} đến ngày ${this.datePipe.transform(this.formRangeDay.value[1], 'dd-MM-yyyy')}`,
        title: 'Xuât bảng lương',
        params: payroll,
        selectDatetime: true,
        api: Api.HR.PAYROLL.EXPORT,
      }
    })
  }

  exportTimeSheet() {
    const value = this.formGroup.value;
    const payroll = {
      code: value.code || '',
      name: value.name,
      position: value.position?.name || '',
      branch: this.formCtrlBranch.value?.name || '',
      exportType: FilterTypeEnum.TIME_SHEET,
      empStatus: this.formEmpStatus.value,
      startedAt: getFirstDayInMonth(new Date(this.formRangeDay.value[0])),
      endedAt: getLastDayInMonth(new Date(this.formRangeDay.value[1])),
    };
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        filename: `Xuất bảng chấm công từ ngày ${this.datePipe.transform(this.formRangeDay.value[0], 'dd-MM-yyyy')} đến ngày ${this.datePipe.transform(this.formRangeDay.value[1], 'dd-MM-yyyy')} `,
        title: 'Xuât bảng chấm công',
        params: payroll,
        selectDatetime: true,
        api: Api.HR.PAYROLL.EXPORT
      }
    })
  }

  exportSeasonal() {
    const value = this.formGroup.value;
    const payrollSeasonal = {
      code: value.code || '',
      name: value.name,
      position: value.position?.name || '',
      branch: this.formCtrlBranch.value?.name || '',
      exportType: FilterTypeEnum.SEASONAL,
      paidAt: value.paidAt,
      accConfirmedAt: value.accConfirmedAt,
      employeeType: EmployeeType.EMPLOYEE_SEASONAL,
      startedAt: this.formRangeDay.value[0],
      endedAt: this.formRangeDay.value[1]
    };
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        filename: `Xuất bản lương công nhật tháng ${this.datePipe.transform(this.formRangeDay.value[0], 'MM-yyyy')}`,
        title: 'Xuât bảng lương công nhật',
        params: payrollSeasonal,
        selectDatetime: true,
        api: Api.HR.PAYROLL.EXPORT
      }
    })
  }

  addCategory() {
    this.dialog.open(DialogCategoryComponent, {width: 'fit-content'}).afterClosed()
      .subscribe(() => this.categories$ = this.categoryService.getAll(
        {branch: this.formCtrlBranch.value ? this.formCtrlBranch.value.name : ''}));
  }

  updateCategory(): any {
    if (this.categoryControl.value === 0 || !this.categoryControl.value) {
      return this.message.error('Chưa chọn danh mục để sửa');
    }
    this.dialog.open(DialogCategoryComponent, {
      width: 'fit-content',
      data: {categoryId: this.categoryControl.value, isUpdate: true}
    }).afterClosed().subscribe(() => {
      this.categories$ = this.categoryService.getAll({
        branch: this.formCtrlBranch.value ?
          this.formCtrlBranch.value.name : ''
      });
    });
  }

  sortPayroll(sort?: MatSort) {
    if (sort) {
      this.sort = sort;
    }
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO: this.mapPayroll(this.formGroup.value)
    }));
  }

  onSelectPosition($event: Position) {
    this.formGroup.get('position')?.setValue($event, {emitEvent: false})
  }

  getRangeDay(): RangeDay {
    return getSelectors<RangeDay>(selectedRangeDayPayroll, this.store)
  }
}
