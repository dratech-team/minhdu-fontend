import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Api, SearchTypeConstant} from '@minhdu-fontend/constants';
import {Branch, Employee, Position, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  ItemContextMenu,
  SalaryTypeEnum,
  SearchTypeEnum,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedAddingPayroll,
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedTotalOvertimePayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {checkInputNumber, getFirstDayInMonth, getLastDayInMonth, getSelectors} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {SalaryService} from '../../service/salary.service';
import {setAll, someComplete, updateSelect} from '../../utils/pick-salary';
import {
  DialogOvertimeMultipleComponent
} from '../dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import {DialogOvertimeComponent} from '../dialog-salary/dialog-overtime/dialog-overtime.component';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PayrollService} from "../../service/payroll.service";
import {Payroll} from "../../+state/payroll/payroll.interface";

@Component({
  selector: 'minhdu-fontend-payroll-overtime',
  templateUrl: 'payroll-overtime.component.html'
})
export class PayrollOvertimeComponent implements OnInit, OnChanges {
  @Input() eventAddOvertime?: Subject<any>;
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectIsLeave?: boolean;
  @Input() eventExportOvertime?: Subject<boolean>;
  @Input() overtimeTitle?: string;
  @Input() createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
  @ViewChild(MatSort) sort!: MatSort;

  ItemContextMenu = ItemContextMenu;
  salaryType = SalaryTypeEnum;
  pageSize = 30;
  pageIndex = 0;
  pageIndexInit = 0;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  salariesSelected: Array<SalaryPayroll> = [];
  salaries: Array<SalaryPayroll> = [];
  searchTypeConstant = SearchTypeConstant;
  isSelectSalary = false;
  isEventSearch = false;
  sortEnum = sortEmployeeTypeEnum;

  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollOvertime$ = this.store.pipe(select(selectorAllPayroll));
  templateOvertime$ = this.payrollService.getAllTempLate({
    branch: getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
    position: getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
    startedAt: this.datePipe.transform(getFirstDayInMonth(this.createdAt), 'yyyy-MM-dd'),
    endedAt: this.datePipe.transform(getLastDayInMonth(this.createdAt), 'yyyy-MM-dd'),
  })
  positions$ = this.store.pipe(select(getAllPosition))
  totalOvertime$ = this.store.pipe(select(selectedTotalOvertimePayroll));
  adding$ = this.store.pipe(select(selectedAddingPayroll));

  formGroup = new FormGroup({
    titles: new FormControl([]),
    code: new FormControl(''),
    name: new FormControl(''),
    isLeave: new FormControl(false),
    startedAt: new FormControl(
      this.datePipe.transform(getFirstDayInMonth(this.createdAt), 'yyyy-MM-dd')
    ),
    endedAt: new FormControl(
      this.datePipe.transform(getLastDayInMonth(this.createdAt), 'yyyy-MM-dd')
    ),
    position: new FormControl(
      getSelectors(selectedPositionPayroll, this.store)
    ),
    branch: new FormControl(
      getSelectors(selectedBranchPayroll, this.store)
    ),
    searchType: new FormControl(SearchTypeEnum.CONTAINS)
  });
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly message: NzMessageService,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly salaryService: SalaryService,
    private readonly activeRouter: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    private readonly payrollService: PayrollService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventSearchBranch?.currentValue !== changes.eventSearchBranch?.previousValue) {
      this.formGroup.get('branch')?.setValue(changes.eventSearchBranch.currentValue)
    }
    if (changes.eventSelectIsLeave?.currentValue !== changes.eventSelectIsLeave?.previousValue) {
      this.formGroup.get('isLeave')?.setValue(changes.eventSelectIsLeave.currentValue)
    }
  }

  ngOnInit() {
    const paramLoadInit = {
      take: this.pageSize,
      skip: this.pageIndex,
      filterType: FilterTypeEnum.OVERTIME,
      position: getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
      branch: getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
      isLeave: false
    };
    this.activeRouter.queryParams.subscribe((val) => {
      if (val.titleOvertime) {
        this.formGroup.get('titles')?.setValue([val.titleOvertime]);
        Object.assign(paramLoadInit, {titles: [val.titleOvertime]});
      }
    });

    if (this.overtimeTitle) {
      Object.assign(paramLoadInit, {
        createdAt: this.datePipe.transform(this.createdAt, 'yyyy-MM-dd')
      });
      this.formGroup.get('titles')?.setValue([this.overtimeTitle]);
      this.formGroup.get('startedAt')?.setValue(
        this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM-dd')
      );
      this.formGroup.get('endedAt')?.setValue(
        this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM-dd')
      );
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

    this.eventAddOvertime?.subscribe((val) => {
      if (val.overtimeTitle) {
        this.formGroup.get('titles')?.setValue([val.overtimeTitle]);
      }
      this.formGroup.get('startAt')?.setValue(
        this.datePipe.transform(new Date(val.createdAt), 'yyyy-MM-dd')
      );
      this.formGroup.get('endAt')?.setValue(
        this.datePipe.transform(new Date(val.createdAt), 'yyyy-MM-dd')
      );
    });

    this.eventExportOvertime?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const overtime = {
          searchType: value.searchType,
          code: value.code,
          titles: value.titles ? value.titles : [],
          filename: val,
          exportType: FilterTypeEnum.OVERTIME,
          position: value.position?.name || '',
          branch: value.branch?.name || '',
          startedAt: value.startedAt,
          endedAt: value.endedAt
        };
        if (value.name) {
          Object.assign(overtime, {name: value.name});
        }
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuất Bảng tăng ca',
            params: overtime,
            typeDate: 'RANGE_DATETIME',
            isPayroll: true,
            api: Api.HR.PAYROLL.EXPORT
          }
        });
      }
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.templateOvertime$ = this.payrollService.getAllTempLate({
        branch: value.branch?.name || '',
        position: value.position?.name || '',
        startedAt: value.startedAt || '',
        endedAt: value.endedAt || '',
      })
      this.isEventSearch = true;
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          createdAt: new Date(value.startedAt),
          position: value.position,
        })
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollOvertime()
        })
      );
    });

    this.payrollOvertime$.subscribe((payrolls) => {
      if (payrolls) {
        this.salaries = [];
        if (payrolls.length === 0) {
          this.isSelectSalary = false;
        }
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (salary.type === SalaryTypeEnum.OVERTIME) {
                if (this.isEventSearch) {
                  this.isSelectSalary =
                    this.salariesSelected.length > 0 &&
                    this.salariesSelected.length >=
                    Number(getSelectors(selectedTotalPayroll, this.store)) &&
                    this.salaries.every((item) =>
                      this.salariesSelected.some(
                        (val) => val.salary.id === item.salary.id
                      )
                    );
                }
                if (
                  this.isSelectSalary &&
                  !this.salariesSelected.some(
                    (item) => item.salary.id === salary.id
                  ) &&
                  !this.salaries.find((e) => e.salary.id === salary.id)
                ) {
                  this.salariesSelected.push({
                    salary: salary,
                    payroll: payroll
                  });
                }
                this.salaries.push({
                  salary: salary,
                  payroll: payroll
                });
              }
            });
          }
        });
      }
    });
  }

  mapPayrollOvertime() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      code: value.code,
      searchType: value.searchType,
      titles: value.titles || [],
      name: value.name,
      unit: value?.unit || '',
      filterType: FilterTypeEnum.OVERTIME,
      position: value.position?.name || '',
      branch: value.branch?.name || '',
      isLeave: value.isLeave
    };
    if (this.sort.active) {
      Object.assign(params, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    if (
      moment(value.startedAt).format('YYYY-MM-DD') ===
      moment(value.endedAt).format('YYYY-MM-DD')
    ) {
      Object.assign(params, {
        createdAt: this.datePipe.transform(value.startedAt, 'YYYY-MM-dd')
      });
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

  addSalaryOvertime() {
    const ref = this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: {
        type: SalaryTypeEnum.OVERTIME
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('startAt')?.setValue(new Date(val.datetime), 'yyyy-MM-dd');
        this.formGroup.get('endAt')?.setValue(new Date(val.datetime), 'yyyy-MM-dd');
        this.formGroup.get('title')?.setValue(val.title);
      }
    });
  }

  updateMultipleSalaryOvertime(): any {
    const uniq = _.uniqWith(this.mapSalary(this.salariesSelected), _.isEqual);
    if (uniq.length === 1) {
      if (!this.salariesSelected[0].salary.unit) {
        return this.message.success('Không sửa lương tùy chọn cho nhiều nhân viên được');
      }
      console.log(this.salariesSelected)
      const ref = this.dialog.open(DialogOvertimeComponent, {
        width: 'fit-content',
        data: {
          type: SalaryTypeEnum.OVERTIME,
          salary: this.salariesSelected[0].salary,
          createdAt: this.salariesSelected[0].salary?.datetime
            ? this.salariesSelected[0].salary?.datetime
            : this.formGroup.get('startAt')?.value,
          salariesSelected: this.salariesSelected,
          updateMultiple: true,
          isUpdate: true
        }
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.isSelectSalary =
          this.salaries.length > 0 &&
          this.salaries.every((e) =>
            this.salariesSelected.some((item) => item.salary.id === e.salary.id)
          );
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
          this.salariesSelected = [];
          this.formGroup.get('titles')?.setValue([val.title]);
          this.formGroup.get('startedAt')?.setValue(new Date(val.datetime), 'yyyy-MM-dd');
          this.formGroup.get('endedAt')?.setValue(new Date(val.datetime), 'yyyy-MM-dd');
        }
      });
    } else {
      const uniqTitle = [...new Set(uniq.map(({title}) => title))];
      const uniqDatetime = [
        ...new Set(
          uniq.map(({datetime}) => moment(datetime).format('DD/MM/YYYY'))
        )
      ];
      const uniqPrice = [...new Set(uniq.map(({price}) => price))];
      const uniqUnit = [...new Set(uniq.map(({unit}) => unit))];

      /// FIXME: Can validate allowance isEqual
      // const uniqAllowance = [
      //   ...new Set(uniq.map(({ allowance }) => allowance)),
      // ];

      // ${
      //   uniqAllowance.length > 1
      //     ? 'phụ cấp tăng ca: ' + uniqAllowance.join(', ') + ', '
      //     : ''
      // }

      this.message.error(
        `Sửa đổi hàng loạt phải giống nhau về Loại tăng ca, đơn vị tính, đơn giá và ngày tăng ca. Mục đang bị sai:
         ${
          uniqTitle.length > 1
            ? ' loại tăng ca: ' + uniqTitle.join(' + ') + `` + ', '
            : ''
        } ${
          uniqUnit.length > 1
            ? 'đơn vị tính: ' + uniqUnit.join(' + ') + ', '
            : ''
        } ${
          uniqPrice.length > 1 ? 'đơn giá: ' + uniqPrice.join(' + ') + ', ' : ''
        } ${
          uniqDatetime.length > 1
            ? 'ngày tăng ca: ' + uniqDatetime.join(' + ') + ', '
            : ''
        }`
      );
    }
  }

  /// FIXME: Can validate allowance isEqual
  mapSalary = (salaries: any[]) =>
    salaries.map(({salary}) => ({
      title: salary.title,
      datetime: salary.datetime,
      forgot: salary.forgot,
      price: salary.price,
      rate: salary.rate,
      type: salary.type,
      unit: salary.unit
      // allowance: {
      //   title: salary?.allowance?.title,
      //   price: salary?.allowance?.price,
      // },
    }));

  deleteMultipleSalaryOvertime(): any {
    this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    }).afterClosed().subscribe((value) => {
      const deleteSuccess = new Subject<number>();
      if (value) {
        this.salariesSelected.forEach((salary, index) => {
          this.salaryService.delete(salary.salary.id).subscribe((_) => {
            deleteSuccess.next(index);
          });
        });
        deleteSuccess.subscribe((val) => {
          if (val === this.salariesSelected.length - 1) {
            this.message.success('Xóa tăng ca thành công');
            this.salariesSelected = [];
            this.isSelectSalary = false;
            this.store.dispatch(
              PayrollAction.loadInit({payrollDTO: this.mapPayrollOvertime()})
            );
          }
        });
      }
    });
  }

  deleteSalaryOvertime(event: any) {
    this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    }).afterClosed().subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollOvertime = {
          searchType: value.searchType,
          startAt: new Date(value.startAt),
          endAt: new Date(value.endAt),
          titles: value.titles ? value.titles : [],
          name: value.name,
          position: value.position?.name || '',
          branch: value.branch.name
        };
        if (!value.name) {
          delete payrollOvertime.name;
        }
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.message.success('Xóa phiếu lương thành công');
            this.store.dispatch(
              PayrollAction.loadInit({payrollDTO: this.mapPayrollOvertime()})
            );
          }
        });
      }
    });
  }

  updateSelectSalary(salary: Salary, payroll: Payroll) {
    const salarySelected = {salary, payroll};
    this.isSelectSalary = updateSelect(
      salarySelected,
      this.salariesSelected,
      this.isSelectSalary,
      this.salaries
    );
  }

  someCompleteSalary(): boolean {
    return someComplete(
      this.salaries,
      this.salariesSelected,
      this.isSelectSalary
    );
  }

  setAllSalary(select: boolean) {
    this.isSelectSalary = setAll(select, this.salaries, this.salariesSelected);
  }

  detailPayroll(id: number) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', id]).then();
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  selectSalary(salary: Salary) {
    return this.salariesSelected.some((e) => e.salary.id === salary.id);
  }

  onScroll() {
    this.isEventSearch = false;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollOvertime()
      })
    );
  }

  sortPayroll() {
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO: this.mapPayrollOvertime()
    }));
  }

}
