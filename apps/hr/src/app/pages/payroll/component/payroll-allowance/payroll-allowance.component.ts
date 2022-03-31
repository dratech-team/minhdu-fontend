import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  ItemContextMenu,
  SalaryTypeEnum,
  SearchTypeEnum,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {Api, SearchTypeConstant, UnitAllowanceConstant} from '@minhdu-fontend/constants';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {debounceTime} from 'rxjs/operators';
import {Branch, Position, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {MatDialog} from '@angular/material/dialog';
import {SalaryService} from '../../service/salary.service';
import {DatePipe} from '@angular/common';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {Router} from '@angular/router';
import {
  checkInputNumber,
  filterSalaryPayroll,
  getFirstDayInMonth,
  getLastDayInMonth,
  getSelectors
} from '@minhdu-fontend/utils';
import {DialogAllowanceComponent} from '../dialog-salary/dialog-allowance/dialog-allowance.component';
import {
  DialogAllowanceMultipleComponent
} from '../dialog-salary/dialog-allowance-multiple/dialog-allowance-multiple.component';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Payroll} from "../../+state/payroll/payroll.interface";
import {ExportService} from "@minhdu-fontend/service";
import {ClassifyOvertimeComponent} from "../classify-overtime/classify-overtime.component";

@Component({
  selector: 'app-payroll-allowance',
  templateUrl: 'payroll-allowance.component.html'
})
export class PayrollAllowanceComponent implements OnInit, OnChanges {
  @Input() eventAddAllowance?: Subject<any>;
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectIsLeave?: boolean;
  @Input() eventExportAllowance?: Subject<any>;
  @Input() allowanceTitle?: string;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  @Input() createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 30;
  pageIndex = 0;
  salariesSelected: SalaryPayroll[] = [];
  isSelectSalary = false;
  salaries: SalaryPayroll[] = [];
  searchTypeConstant = SearchTypeConstant;
  ItemContextMenu = ItemContextMenu;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  unitAllowance = UnitAllowanceConstant;
  isEventSearch = false;
  sortEnum = sortEmployeeTypeEnum;
  loadingDelete = false
  totalSalaryAllowance$ = this.store.select(selectedTotalPayroll);
  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollAllowance$ = this.store.pipe(select(selectorAllPayroll));
  positions$ = this.store.pipe(select(getAllPosition))
  formGroup = new FormGroup({
    titles: new FormControl(''),
    code: new FormControl(''),
    unit: new FormControl(''),
    name: new FormControl(''),
    isLeave: new FormControl(false),
    createdAt: new FormControl(
      this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM')
    ),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(
      getSelectors(selectedPositionPayroll, this.store)
    ),
    branch: new FormControl(
      getSelectors(selectedBranchPayroll, this.store)
    ),
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
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          take: this.pageSize,
          skip: this.pageIndex,
          startedAt: getFirstDayInMonth(new Date(this.createdAt)),
          endedAt: getLastDayInMonth(new Date(this.createdAt)),
          titles: this.allowanceTitle ? [this.allowanceTitle] : [],
          filterType: FilterTypeEnum.ALLOWANCE,
          position: getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
          branch: getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
          isLeave: false
        }
      })
    );
    if (this.allowanceTitle) {
      this.formGroup.get('titles')?.setValue(this.allowanceTitle, {emitEvent: false});

      this.formGroup.get('createdAt')?.setValue(
        this.datePipe.transform(
          new Date(getSelectors(selectedCreateAtPayroll, this.store)),
          'yyyy-MM'
        ),
        {emitEvent: false}
      );
    }

    this.eventAddAllowance?.subscribe((val) => {
      this.formGroup.get('titles')?.setValue(val.allowanceTitle, {emitEvent: false});
      this.formGroup.get('createdAt')?.setValue(
        this.datePipe.transform(
          new Date(getSelectors(selectedCreateAtPayroll, this.store)),
          'yyyy-MM'
        ),
        {emitEvent: false}
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: {
            take: this.pageSize,
            skip: this.pageIndex,
            startedAt: getFirstDayInMonth( new Date(
              getSelectors(selectedCreateAtPayroll, this.store)
            )),
            endedAt: getLastDayInMonth( new Date(
              getSelectors(selectedCreateAtPayroll, this.store)
            )),
            titles: val.allowanceTitle ? [val.allowanceTitle] : [],
            filterType: FilterTypeEnum.ALLOWANCE,
            position: getSelectors(selectedPositionPayroll, this.store),
            branch: getSelectors(selectedBranchPayroll, this.store),
            isLeave: this.formGroup.value.isLeave
          }
        })
      );
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.store.dispatch(PayrollAction.updateStatePayroll({createdAt: new Date(value.createdAt)}));
      this.store.dispatch(PayrollAction.updateStatePosition({position: value.position}));
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollAllowance()
        })
      );
    });

    this.payrollAllowance$.subscribe((payrolls) => {
      if (payrolls) {
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (salary.type === SalaryTypeEnum.ALLOWANCE) {
                this.salaries.push({salary, payroll});
                if (filterSalaryPayroll(this.salariesSelected, salary).length > 0 &&
                  this.salariesSelected.every(salaryPayroll => salaryPayroll.salary.id !== salary.id)
                ) {
                  this.salariesSelected.push({salary, payroll})
                }
              }
            });
          }
        });
      }
    });

    this.eventExportAllowance?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollAllowance = {
          code: value.code || '',
          name: value.name,
          position: value.position?.name || '',
          branch: value.branch.name || '',
          exportType: FilterTypeEnum.ALLOWANCE,
          titles: value.titles ? [value.titles] : [],
          isLeave: value.isLeave,
        };
        if (value.createdAt) {
          Object.assign(payrollAllowance, {
            startedAt: getFirstDayInMonth(new Date(value.createdAt)),
            endedAt: getLastDayInMonth(new Date(value.createdAt)),
          });
        }
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            filename: `Xuất bảng phụ cấp khác tháng ${this.datePipe.transform(value.createdAt, 'MM-yyyy')}`,
            title: 'Xuât bảng phụ cấp khác',
            params: payrollAllowance,
            isPayroll: true,
          }
        }).afterClosed().subscribe(val => {
          if (val) {
            this.exportService.print(
              Api.HR.PAYROLL.EXPORT,
              val.params,
              {items: val.itemSelected}
            );
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

  addSalaryAllowance() {
    const ref = this.dialog.open(DialogAllowanceMultipleComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('titles')?.setValue(val.title, {emitEvent: false});
        this.formGroup.get('createdAt')?.setValue(val.datetime, {emitEvent: false});
        const value = this.formGroup.value;
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: {
              take: this.pageSize,
              skip: this.pageIndex,
              code: value.code,
              unit: value.unit,
              startedAt: getFirstDayInMonth(new Date(val.createdAt)),
              endedAt: getLastDayInMonth(new Date(val.createdAt)),
              titles: [val.title],
              filterType: FilterTypeEnum.ALLOWANCE,
              position: val.position?.name || '',
              branch: value.branch.name || '',
              isLeave: val.isLeave
            }
          })
        );
      }
    });
  }

  updateMultipleSalaryAllowance() {
    const value = this.formGroup.value;
    if (
      this.salariesSelected.every((value, index, array) => {
        return (
          value.salary.title === array[0].salary.title &&
          value.salary.datetime === array[0].salary.datetime &&
          value.salary.unit === array[0].salary.unit
        );
      })
    ) {
      const ref = this.dialog.open(DialogAllowanceComponent, {
        width: 'fit-content',
        data: {
          isUpdate: true,
          salary: this.salariesSelected[0].salary,
          salariesSelected: this.salariesSelected,
          updateMultiple: true,
          type: SalaryTypeEnum.ALLOWANCE
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
          this.isSelectSalary = false;
          this.salariesSelected = [];
          this.formGroup.get('titles')?.setValue(val.title, {emitEvent: false});
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: {
                take: this.pageSize,
                skip: this.pageIndex,
                code: this.formGroup.get('code')?.value,
                unit: this.formGroup.get('unit')?.value,
                searchType: value.searchType,
                startedAt: getFirstDayInMonth(new Date(value.createdAt)),
                endedAt: getLastDayInMonth(new Date(value.createdAt)),
                titles: [val.title],
                name: value.name,
                filterType: FilterTypeEnum.ALLOWANCE,
                position: val.position,
                branch: this.formGroup.value.name || '',
                isLeave: this.formGroup.value.isLeave
              }
            })
          );
        }
      });
    } else {
      this.message.error('chưa chọn cùng loại lương');
    }
  }

  deleteMultipleSalaryAllowance() {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.loadingDelete = true
        const deleteSuccess = new Subject<number>();
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
            this.isSelectSalary = false;
            this.salariesSelected = [];
            this.message.success('Xóa lương cơ bản thành công');
            this.store.dispatch(
              PayrollAction.loadInit({payrollDTO: this.mapPayrollAllowance()})
            );
          }
        });
      }
    });
  }

  deleteSalaryAllowance(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.store.dispatch(
              PayrollAction.loadInit({
                payrollDTO: this.mapPayrollAllowance()
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
    const value = this.formGroup.value;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollAllowance()
      })
    );
  }

  updateSelectSalary(salary: Salary, payroll: Payroll, event: boolean) {
    this.dialog.open(ClassifyOvertimeComponent, {
      data: {
        title: 'Chọn loại Phụ cấp khác',
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
        if(event){
          this.salariesSelected.push({salary, payroll});
        }else{
          const index = this.salariesSelected.findIndex(value => value.salary.id === salary.id)
          this.salariesSelected.splice(index,1)
        }
      }
    })
  }

  mapPayrollAllowance() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      code: value.code,
      unit: value.unit,
      searchType: value.searchType,
      startedAt: getFirstDayInMonth(new Date(value.createdAt)),
      endedAt: getLastDayInMonth(new Date(value.createdAt)),
      titles: value.titles ? [value.titles] : [],
      name: value.name,
      filterType: FilterTypeEnum.ALLOWANCE,
      position: value.position?.name || '',
      branch: value.branch.name || '',
      isLeave: value.isLeave
    };
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
      payrollDTO: this.mapPayrollAllowance()
    }));
  }
}
