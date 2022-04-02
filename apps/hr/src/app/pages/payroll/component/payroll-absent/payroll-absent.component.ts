import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, SearchTypeConstant} from '@minhdu-fontend/constants';
import {Branch, Position, RangeDay, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  ItemContextMenu,
  SalaryTypeEnum,
  SearchTypeEnum,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {PositionService} from '@minhdu-fontend/orgchart';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedRangeDayPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {UnitAbsentConstant} from '../../../../../../../../libs/constants/HR/unitAbsent.constant';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {checkInputNumber, filterSalaryPayroll, getSelectors} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {SalaryService} from '../../service/salary.service';
import {DialogAbsentComponent} from '../dialog-salary/dialog-absent/dialog-absent.component';
import {DialogTimekeepingComponent} from '../dialog-salary/timekeeping/dialog-timekeeping.component';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Payroll} from "../../+state/payroll/payroll.interface";
import {ExportService} from "@minhdu-fontend/service";
import {ClassifyOvertimeComponent} from "../classify-overtime/classify-overtime.component";

@Component({
  selector: 'app-payroll-absent',
  templateUrl: 'payroll-absent.component.html'
})

export class PayrollAbsentComponent implements OnInit, OnChanges {
  @Input() eventAddAbsent?: Subject<any>;
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectIsLeave?: boolean;
  @Input() eventExportAbsent?: Subject<boolean>;
  @Input() absentTitle?: string;
  @Input() eventSelectRangeDay = new Subject<boolean>();
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 30;
  pageIndex = 0;
  ItemContextMenu = ItemContextMenu;
  datetimeUnit = DatetimeUnitEnum;
  unitAbsent = UnitAbsentConstant;
  isEventSearch = false;
  searchTypeConstant = SearchTypeConstant;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  salariesSelected: SalaryPayroll[] = [];
  salaries: SalaryPayroll[] = [];
  sortEnum = sortEmployeeTypeEnum;
  loadingDelete = false
  totalSalaryAbsent$ = this.store.select(selectedTotalPayroll);
  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollAbsent$ = this.store.pipe(select(selectorAllPayroll));
  positions$ = this.store.pipe(select(getAllPosition))

  formGroup = new FormGroup({
    titles: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    unit: new FormControl(''),
    isLeave: new FormControl(false),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(getSelectors(selectedPositionPayroll, this.store)),
    branch: new FormControl(getSelectors(selectedBranchPayroll, this.store)),
  });
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);


  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    private readonly router: Router,
    private readonly ref: ChangeDetectorRef,
    private readonly positionService: PositionService,
    private readonly exportService: ExportService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventSearchBranch?.currentValue !== changes.eventSearchBranch?.previousValue) {
      this.formGroup.get('branch')?.patchValue(changes.eventSearchBranch.currentValue)
    }
    if (changes.eventSelectIsLeave?.currentValue !== changes.eventSelectIsLeave?.previousValue) {
      this.formGroup.get('isLeave')?.setValue(changes.eventSelectIsLeave.currentValue)
    }
  }

  ngOnInit() {
    const paramLoadInit = {
      take: this.pageSize,
      skip: this.pageIndex,
      filterType: FilterTypeEnum.ABSENT,
      startedAt: this.getRangeDay().start,
      endedAt: this.getRangeDay().end,
      position: getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
      branch: getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
      isLeave: false
    };

    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: paramLoadInit
      })
    );

    if (this.absentTitle) {
      this.formGroup.get('titles')?.setValue(this.absentTitle);
    }

    this.eventAddAbsent?.subscribe((val) => {
      this.formGroup.get('titles')?.setValue(val.absentTitle);
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.store.dispatch(PayrollAction.updateStatePosition({position: value.position}));
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollAbsent()
        })
      );
    });

    this.payrollAbsent$.subscribe((payrolls) => {
      if (payrolls) {
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (
                salary.type === SalaryTypeEnum.ABSENT ||
                salary.type === SalaryTypeEnum.DEDUCTION ||
                salary.type === SalaryTypeEnum.DAY_OFF
              ) {
                this.salaries.push({salary: salary, payroll: payroll})
                if (filterSalaryPayroll(this.salariesSelected, salary).length > 0
                  && (this.salariesSelected.every(salaryPayroll => salaryPayroll.salary.id !== salary.id))
                ) {
                  this.salariesSelected.push({payroll: payroll, salary})
                }
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
          position: value.position?.name || '',
          branch: value.branch.name || '',
          exportType: FilterTypeEnum.ABSENT,
          titles: value.titles ? value.titles : [],
          startedAt: this.getRangeDay().start,
          endedAt: this.getRangeDay().end,
          isLeave: value.isLeave
        };
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            filename: `Xuất bản khấu trừ tháng từ ngày ${this.datePipe.transform(payrollAbsent.startedAt, 'dd-MM-yyyy')} đến ngày ${this.datePipe.transform(payrollAbsent.endedAt, 'dd-MM-yyyy')}`,
            title: 'Xuât bảng khấu trừ',
            typeDate: 'RANGE_DATETIME',
            params: payrollAbsent,
            selectDatetime: true,
            api: Api.HR.PAYROLL.EXPORT,
          }
        })
      }
    });
    this.eventSelectRangeDay.pipe(debounceTime(100)).subscribe(val => {
      if (val) {
        this.store.dispatch(PayrollAction.loadInit({
          payrollDTO: this.mapPayrollAbsent()
        }))
      }
    })
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
        this.store.dispatch(PayrollAction.updateStatePayroll({
          rangeDay: {
            start: new Date(val.datetime),
            end: new Date(val.datetime),
          }
        }))
        this.formGroup.get('titles')?.setValue(val.title, {emitEvent: false});
        this.store.dispatch(PayrollAction.loadInit({payrollDTO: this.mapPayrollAbsent()}))
      }
    });
  }

  updateMultipleSalaryAbsent() {
    if (
      this.salariesSelected.every((value, index, array) => {
        return (
          value.salary.title === array[0].salary.title &&
          value.salary.datetime === array[0].salary.datetime
        );
      })
    ) {
      const ref = this.dialog.open(DialogAbsentComponent, {
        width: 'fit-content',
        data: {
          isUpdate: true,
          salary: this.salariesSelected[0].salary,
          salariesSelected: this.salariesSelected,
          updateMultiple: true,
          createdAt: this.getRangeDay().start,
          type: SalaryTypeEnum.ABSENT
        }
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
          this.salariesSelected = [];
          this.formGroup.get('titles')?.setValue(val.title, {emitEvent: false});
          if (val.datetime) {
            this.store.dispatch(PayrollAction.updateStatePayroll({
              rangeDay: {
                start: new Date(val.datetime),
                end: new Date(val.datetime),
              }
            }))
          }
          this.store.dispatch(PayrollAction.loadInit({
            payrollDTO: this.mapPayrollAbsent()
          }))
        }
      });
    } else {
      this.message.error('chưa chọn cùng loại lương');
    }
  }

  deleteMultipleSalaryAbsent() {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        const deleteSuccess = new Subject<number>();
        this.loadingDelete = true
        this.salariesSelected.forEach((item, index) => {
          this.salaryService.delete(item.salary.id).subscribe((val: any) => {
            if (val) {
              deleteSuccess.next(index);
            }
          });
        });
        deleteSuccess.subscribe((val) => {
          if (val === this.salariesSelected.length - 1) {
            this.loadingDelete = false
            this.salariesSelected = [];
            this.message.success('Xóa khấu trừ thành công');
            this.store.dispatch(
              PayrollAction.loadInit({payrollDTO: this.mapPayrollAbsent()})
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
            this.message.success('Xóa phiếu lương thành công');
          }
        });
      }
    });
  }

  onScroll() {
    this.isEventSearch = false;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollAbsent()
      })
    );
  }

  updateSelectSalary(salary: Salary, payroll: Payroll, event: boolean) {
    this.dialog.open(ClassifyOvertimeComponent, {
      data: {
        title: 'Chọn loại khấu trừ',
        type: event ? "SELECT" : "REMOVE",
        salary
      }
    }).afterClosed().subscribe(type => {
      if (type === 'ALL') {
        if (event) {
          this.salariesSelected = [...
            filterSalaryPayroll(this.salaries, salary)
          ]
        } else {
          filterSalaryPayroll(this.salaries, salary).forEach(val => {
            const index = this.salariesSelected.findIndex(value => value.salary.id === val.salary.id)
            this.salariesSelected.splice(index, 1)
          })
        }

      } else {
        if (event) {
          this.salariesSelected.push({salary, payroll});
        } else {
          const index = this.salariesSelected.findIndex(value => value.salary.id === salary.id)
          this.salariesSelected.splice(index, 1)
        }
      }
    })
  }

  mapPayrollAbsent() {
    const value = this.formGroup.value;
    const params = {
        take: this.pageSize,
        skip: this.pageIndex,
        code: value.code,
        searchType: value.searchType,
        titles: value.titles ? [value.titles] : [],
        name: value.name,
        unit: value.unit,
        filterType: FilterTypeEnum.ABSENT,
        position: value.position?.name || '',
        branch: value.branch.name || '',
        isLeave: value.isLeave,
        startedAt: this.getRangeDay().start,
        endedAt: this.getRangeDay().end,
      }
    ;
    if (this.sort?.active) {
      Object.assign(params, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    if (!value.name) {
      delete params.name;
    }
    return params;
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  selectSalary(salary: Salary) {
    return this.salariesSelected.some((e) => e.salary.id === salary.id);
  }

  sortPayroll() {
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO: this.mapPayrollAbsent()
    }));
  }

  getRangeDay(): RangeDay {
    return getSelectors<RangeDay>(selectedRangeDayPayroll, this.store)
  }
}
