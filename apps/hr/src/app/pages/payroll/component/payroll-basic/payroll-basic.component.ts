import {DatePipe} from '@angular/common';
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
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, SearchTypeConstant} from '@minhdu-fontend/constants';
import {Branch, Position, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
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
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {
  checkInputNumber,
  filterSalaryPayroll,
  getFirstDayInMonth,
  getLastDayInMonth,
  getSelectors,
  updateSelectOneSalaryPayroll
} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {SalaryService} from '../../service/salary.service';
import {DialogBasicComponent} from '../dialog-salary/dialog-basic/dialog-basic.component';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PayrollService} from "../../service/payroll.service";
import {ExportService} from "@minhdu-fontend/service";
import {ClassifyOvertimeComponent} from "../classify-overtime/classify-overtime.component";

@Component({
  selector: 'minhdu-fontend-payroll-basic',
  templateUrl: 'payroll-basic.component.html'
})
export class PayrollBasicComponent implements OnInit, OnChanges {
  @Input() eventExportBasic?: Subject<boolean>;
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectIsLeave?: boolean;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  @ViewChild(MatSort) sort!: MatSort;

  positions$ = this.store.pipe(select(getAllPosition))
  totalSalaryBasic$ = this.store.select(selectedTotalPayroll);
  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollBasic$ = this.store.pipe(select(selectorAllPayroll));
  createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
  sortEnum = sortEmployeeTypeEnum;
  pageSize = 30;
  pageIndex = 0;
  salaries: SalaryPayroll[] = [];
  salariesSelected: SalaryPayroll[] = [];
  isEventSearch = false;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  ItemContextMenu = ItemContextMenu;
  searchTypeConstant = SearchTypeConstant;
  templateBasic: string[] = []
  formGroup = new FormGroup({
    titles: new FormControl([]),
    code: new FormControl(''),
    name: new FormControl(''),
    isLeave: new FormControl(false),
    createdAt: new FormControl(
      this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM')
    ),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(getSelectors(selectedPositionPayroll, this.store)),
    branch: new FormControl(getSelectors(selectedBranchPayroll, this.store)),
  });
  loadingDelete = false
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    private readonly router: Router,
    private ref: ChangeDetectorRef,
    private payrollService: PayrollService,
    private exportService: ExportService,
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
          filterType: FilterTypeEnum.BASIC,
          startedAt: getFirstDayInMonth(new Date(this.createdAt)),
          endedAt: getLastDayInMonth(new Date(this.createdAt)),
          position: getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
          branch: getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
          isLeave: false
        }
      })
    );
    this.getTemplateBasic(
      this.createdAt,
      getSelectors<Branch>(selectedBranchPayroll, this.store)?.name,
      getSelectors<Position>(selectedPositionPayroll, this.store)?.name
    )

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      if (value.createdAt) {
        this.getTemplateBasic(value.createdAt, value.branch?.name, value.position?.name)
      }
      this.store.dispatch(PayrollAction.updateStatePayroll({createdAt: new Date(value.createdAt)}));
      this.store.dispatch(PayrollAction.updateStatePosition({position: value.position}));
      this.store.dispatch(PayrollAction.loadInit({payrollDTO: this.mapPayrollBasic()}));
    });

    this.payrollBasic$.subscribe((payrolls) => {
      if (payrolls) {
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (
                salary.type === SalaryTypeEnum.BASIC_INSURANCE ||
                salary.type === SalaryTypeEnum.BASIC
              ) {
                this.salaries.push({salary, payroll: payroll});
                if (filterSalaryPayroll(this.salariesSelected, salary).length > 0 &&
                  this.salariesSelected.every(salaryPayroll => salaryPayroll.payroll.id !== salary.id)
                ) {
                  this.salariesSelected.push({salary, payroll})
                }
              }
            });
          }
        });
      }
    });

    this.eventExportBasic?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollBASIC = {
          code: value.code || '',
          name: value.name,
          position: value.position?.name || '',
          branch: value.branch.name || '',
          exportType: FilterTypeEnum.BASIC,
          titles: value.titles,
          isLeave: value.isLeave,
          searchType: value.searchType,
          filterType: FilterTypeEnum.BASIC,
        };
        if (value.createdAt) {
          Object.assign(payrollBASIC, {
            startedAt: getFirstDayInMonth(new Date(value.createdAt)),
            endedAt: getLastDayInMonth(new Date(value.createdAt)),});
        }
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            filename: `Xuất bảng lương cơ bản tháng ${this.datePipe.transform(this.formGroup.value.createdAt, 'MM-yyyy')}`,
            title: 'Xuât bảng lương cơ bản',
            params: payrollBASIC,
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
      .navigate(['phieu-luong/chi-tiet-phieu-luong', event.id])
      .then();
  }

  addSalaryBasic() {
    const ref = this.dialog.open(DialogBasicComponent, {
      width: 'fit-content',
      data: {
        createdAt: this.formGroup.get('createdAt')?.value,
        addMultiple: true,
        type: SalaryTypeEnum.BASIC
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('titles')?.setValue([val.title], {emitEvent: false});
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: {
              take: this.pageIndex,
              skip: this.pageSize,
              code: this.formGroup.get('code')?.value,
              startedAt: getFirstDayInMonth(new Date(this.formGroup.value.createdAt)),
              endedAt: getLastDayInMonth(new Date(this.formGroup.value.createdAt)),
              titles: [val.title],
              position: val.position,
              branch: this.formGroup.value.branch.name || '',
              isLeave: this.formGroup.value.isLeave
            }
          })
        );
      }
    });
  }

  updateMultipleSalaryBasic() {
    const value = this.formGroup.value;
    if (
      this.salariesSelected.every((value, index, array) => {
        return value.salary.title === array[0].salary.title;
      })
    ) {
      const ref = this.dialog.open(DialogBasicComponent, {
        width: 'fit-content',
        data: {
          updateMultiple: true,
          isUpdate: true,
          salary: this.salariesSelected[0].salary,
          salariesSelected: this.salariesSelected
        }
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
          if (val.salariesSelected) {
            this.salariesSelected = val.salariesSelected;
          }
          this.salariesSelected = [];
          this.formGroup.get('titles')?.setValue([val.title], {emitEvent: false});
          const params = {
            take: this.pageSize,
            skip: this.pageIndex,
            code: this.formGroup.get('code')?.value,
            searchType: value.searchType,
            startedAt: getFirstDayInMonth(new Date(value.createdAt)),
            endedAt: getLastDayInMonth(new Date(value.createdAt)),
            titles: [val.title],
            name: this.formGroup.get('name')?.value,
            filterType: FilterTypeEnum.BASIC,
            position: value.position?.name || '',
            branch: value.branch.name || '',
            isLeave: value.isLeave
          };
          if (this.formGroup.get('name')?.value === '') {
            delete params.name;
          }
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: params
            })
          );
        }
      });
    } else {
      this.message.error('chưa chọn cùng loại lương');
    }
  }

  deleteMultipleSalaryBasic() {
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
            this.salariesSelected = [];
            this.message.success('Xóa lương cơ bản thành công');
            this.store.dispatch(
              PayrollAction.loadInit({payrollDTO: this.mapPayrollBasic()})
            );
          }
        });
      }
    });
  }

  deleteSalaryBasic(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.message.success(val.message);
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.store.dispatch(
              PayrollAction.loadInit({
                payrollDTO: this.mapPayrollBasic()
              })
            );
            this.message.success('Xóa phiếu lương thành công');
          }
        });
      }
    });
  }

  onScroll() {
    this.isEventSearch = true;
    const value = this.formGroup.value;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollBasic()
      })
    );
  }

  mapPayrollBasic() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      code: value.code,
      searchType: value.searchType,
      startedAt: getFirstDayInMonth(new Date(value.createdAt)),
      endedAt: getLastDayInMonth(new Date(value.createdAt)),
      titles: value.titles,
      name: value.name,
      filterType: FilterTypeEnum.BASIC,
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

  updateSelectSalary(salarySelected: SalaryPayroll,event: boolean) {
    this.dialog.open(ClassifyOvertimeComponent, {
      data: {
        title: 'Chọn loại lương cơ bản',
        type: event ? "SELECT" : "REMOVE",
        salary : salarySelected.salary
      }
    }).afterClosed().subscribe(type => {
      if (type === 'ALL') {
        if (event) {
          this.salariesSelected = [...
            filterSalaryPayroll(this.salaries, salarySelected.salary)
          ]
        } else {
          filterSalaryPayroll(this.salaries, salarySelected.salary).forEach(val => {
            const index = this.salariesSelected.findIndex(value => value.salary.id === val.salary.id)
            this.salariesSelected.splice(index, 1)
          })
        }

      } else {
        updateSelectOneSalaryPayroll(event, salarySelected, this.salariesSelected)
      }
    })
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  selectSalary(salary: Salary) {
    return this.salariesSelected.some((e) => e.salary.id === salary.id);
  }

  sortPayroll() {
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO: this.mapPayrollBasic()
    }));
  }

  getTemplateBasic(createdAt: Date, branch?: string, position?: string) {
    this.payrollService.getAllTempLate({
      branch: branch || '',
      position: position || '',
      startedAt: this.datePipe.transform(getFirstDayInMonth(new Date(createdAt)), 'yyyy-MM-dd'),
      endedAt: this.datePipe.transform(getLastDayInMonth(new Date(createdAt)), 'yyyy-MM-dd'),
      salaryType: SalaryTypeEnum.BASIC
    }).subscribe(val => this.templateBasic = val)
  }
}
