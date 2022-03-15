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
import {of, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {Api, SearchTypeConstant, UnitAllowanceConstant} from '@minhdu-fontend/constants';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {debounceTime, startWith} from 'rxjs/operators';
import {Branch, Employee, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {setAll, someComplete, updateSelect} from '../../utils/pick-salary';
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
import {checkInputNumber, getSelectors, searchAutocomplete} from '@minhdu-fontend/utils';
import {DialogAllowanceComponent} from '../dialog-salary/dialog-allowance/dialog-allowance.component';
import {
  DialogAllowanceMultipleComponent
} from '../dialog-salary/dialog-allowance-multiple/dialog-allowance-multiple.component';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-payroll-allowance',
  templateUrl: 'payroll-allowance.component.html'
})
export class PayrollAllowanceComponent implements OnInit, OnChanges {
  @Input() eventAddAllowance?: Subject<any>;
  @Input() eventSearchBranch?: Branch;
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

  totalSalaryAllowance$ = this.store.select(selectedTotalPayroll);
  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollAllowance$ = this.store.pipe(select(selectorAllPayroll));
  positions$ = this.store.pipe(select(getAllPosition))
  formGroup = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    unit: new FormControl(''),
    name: new FormControl(''),
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

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    private readonly router: Router,
    private readonly ref: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventSearchBranch.currentValue !== changes.eventSearchBranch.previousValue) {
      this.formGroup.get('branch')?.patchValue(changes.eventSearchBranch.currentValue)
    }
  }

  ngOnInit() {
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          take: this.pageSize,
          skip: this.pageIndex,
          createdAt: new Date(this.createdAt),
          title: this.allowanceTitle ? this.allowanceTitle : '',
          filterType: FilterTypeEnum.ALLOWANCE,
          position: getSelectors(selectedPositionPayroll, this.store),
          branch: getSelectors(selectedBranchPayroll, this.store)
        }
      })
    );
    if (this.allowanceTitle) {
      this.formGroup.get('title')?.setValue(this.allowanceTitle, {emitEvent: false});

      this.formGroup.get('createdAt')?.setValue(
        this.datePipe.transform(
          new Date(getSelectors(selectedCreateAtPayroll, this.store)),
          'yyyy-MM'
        ),
        {emitEvent: false}
      );
    }

    this.eventAddAllowance?.subscribe((val) => {
      this.formGroup.get('title')?.setValue(val.allowanceTitle, {emitEvent: false});
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
            createdAt: new Date(
              getSelectors(selectedCreateAtPayroll, this.store)
            ),
            title: val.allowanceTitle ? val.allowanceTitle : '',
            filterType: FilterTypeEnum.ALLOWANCE,
            position: getSelectors(selectedPositionPayroll, this.store),
            branch: getSelectors(selectedBranchPayroll, this.store)
          }
        })
      );
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          createdAt: new Date(value.createdAt),
          position: value.position,
        })
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollAllowance()
        })
      );
    });

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.positions$
    );

    this.payrollAllowance$.subscribe((payrolls) => {
      if (payrolls) {
        if (payrolls.length === 0) {
          this.isSelectSalary = false;
        }
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (salary.type === SalaryTypeEnum.ALLOWANCE) {
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
                    salary,
                    employee: payroll.employee
                  });
                }
                this.salaries.push({salary, employee: payroll.employee});
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
          position: value.position,
          branch: value.branch ? value.branch.name : '',
          exportType: FilterTypeEnum.ALLOWANCE,
          title: value.title
        };
        if (value.createdAt) {
          Object.assign(payrollAllowance, {createdAt: value.createdAt});
        }
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuât bảng phụ cấp khác',
            exportType: FilterTypeEnum.ALLOWANCE,
            params: payrollAllowance,
            isPayroll: true,
            api: Api.HR.PAYROLL.EXPORT
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
        this.formGroup.get('title')?.setValue(val.title, {emitEvent: false});
        this.formGroup.get('createdAt')?.setValue(val.datetime, {emitEvent: false});
        const value = this.formGroup.value;
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: {
              take: this.pageSize,
              skip: this.pageIndex,
              code: value.code,
              unit: value.unit,
              createdAt: new Date(val.datetime),
              title: val.title,
              filterType: FilterTypeEnum.ALLOWANCE,
              position: val.position,
              branch: val.branch ? value.branch.name : ''
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
          this.formGroup.get('title')?.setValue(val.title, {emitEvent: false});
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: {
                take: this.pageSize,
                skip: this.pageIndex,
                code: this.formGroup.get('code')?.value,
                unit: this.formGroup.get('unit')?.value,
                searchType: value.searchType,
                createdAt: new Date(value.createdAt),
                title: val.title,
                name: value.name,
                filterType: FilterTypeEnum.ALLOWANCE,
                position: val.position,
                branch: this.formGroup.value.branch ? this.formGroup.value.name : ''

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

  updateSelectSalary(salary: Salary, employee: Employee) {
    const salarySelected = {salary, employee};
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

  mapPayrollAllowance() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      code: value.code,
      unit: value.unit,
      searchType: value.searchType,
      createdAt: new Date(value.createdAt),
      salaryTitle: value.title ? value.title : '',
      name: value.name,
      filterType: FilterTypeEnum.ALLOWANCE,
      position: value.position,
      branch: value.branch ? value.branch.name : ''
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

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
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
