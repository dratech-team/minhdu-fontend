import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
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
import {select, Store} from '@ngrx/store';
import {Subject, throwError} from 'rxjs';
import {catchError, debounceTime} from 'rxjs/operators';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedEmpStatusPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedRangeDayPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {checkInputNumber, filterSalaryPayroll, getSelectors, updateSelectOneSalaryPayroll} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {SalaryService} from '../../service/salary.service';
import {DialogBasicComponent} from '../dialog-salary/dialog-basic/dialog-basic.component';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PayrollService} from "../../service/payroll.service";
import {ExportService} from "@minhdu-fontend/service";
import {ClassifyOvertimeComponent} from "../classify-overtime/classify-overtime.component";

@Component({
  selector: 'app-payroll-basic',
  templateUrl: 'payroll-basic.component.html'
})
export class PayrollBasicComponent implements OnInit, OnChanges {
  @Input() eventExportBasic?: Subject<boolean>;
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectEmpStatus?: number;
  @Input() eventSelectRangeDay = new Subject<boolean>();
  @ViewChild(MatSort) sort!: MatSort;

  positions$ = this.store.pipe(select(getAllPosition))
  totalSalaryBasic$ = this.store.select(selectedTotalPayroll);
  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollBasic$ = this.store.pipe(select(selectorAllPayroll));
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
  formGroup = new UntypedFormGroup({
    titles: new UntypedFormControl([]),
    code: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    empStatus: new UntypedFormControl(getSelectors<number>(selectedEmpStatusPayroll, this.store)),
    searchType: new UntypedFormControl(SearchTypeEnum.CONTAINS),
    position: new UntypedFormControl(getSelectors(selectedPositionPayroll, this.store)),
    branch: new UntypedFormControl(getSelectors(selectedBranchPayroll, this.store)),
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
    if (changes.eventSelectEmpStatus?.currentValue !== changes.eventSelectEmpStatus?.previousValue) {
      this.formGroup.get('empStatus')?.setValue(changes.eventSelectEmpStatus.currentValue)
    }
  }

  ngOnInit() {
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          take: this.pageSize,
          skip: this.pageIndex,
          filterType: FilterTypeEnum.BASIC,
          startedAt: this.getRangeDay().start,
          endedAt: this.getRangeDay().end,
          position: getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
          branch: getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
          empStatus: getSelectors<number>(selectedEmpStatusPayroll, this.store)
        }
      })
    );
    this.getTemplateBasic(
      getSelectors<Branch>(selectedBranchPayroll, this.store)?.name,
      getSelectors<Position>(selectedPositionPayroll, this.store)?.name
    )

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.getTemplateBasic(value.branch?.name, value.position?.name)
      this.isEventSearch = true;
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
          empStatus: value.empStatus,
          searchType: value.searchType,
          filterType: FilterTypeEnum.BASIC,
          startedAt: this.getRangeDay().start,
          endedAt: this.getRangeDay().end,
        };
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            filename: `Xuất bảng lương cơ bản từ ngày ${this.datePipe.transform(payrollBASIC.startedAt, 'dd-MM-yyyy')} đến ngày ${this.datePipe.transform(payrollBASIC.endedAt, 'dd-MM-yyyy')}`,
            title: 'Xuât bảng lương cơ bản',
            params: payrollBASIC,
            selectDatetime: true,
            api: Api.HR.PAYROLL.EXPORT,
          }
        })
      }
    });

    this.eventSelectRangeDay.subscribe(val => {
      if (val) {
        this.store.dispatch(PayrollAction.loadInit({
          payrollDTO: this.mapPayrollBasic()
        }))
      }
    })
  }

  readPayroll(event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', event.id])
      .then();
  }

  addSalaryBasic(salaryBasic: Salary) {
    const ref = this.dialog.open(DialogBasicComponent, {
      width: 'fit-content',
      data: {
        createdAt: this.getRangeDay().start,
        addMultiple: true,
        salary: salaryBasic,
        type: SalaryTypeEnum.BASIC,
        selectEmp: true
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        // hiện ở v2 thì lương cơ bản ko cho search theo title
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: this.mapPayrollBasic()
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
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: this.mapPayrollBasic()
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
        deleteSuccess.pipe(catchError(err => {
          this.loadingDelete = false
          return throwError(err)
        })).subscribe((val) => {
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
      startedAt: this.getRangeDay().start,
      endedAt: this.getRangeDay().end,
      titles: value.titles,
      name: value.name,
      filterType: FilterTypeEnum.BASIC,
      position: value.position?.name || '',
      branch: value.branch.name || '',
      empStatus: value.empStatus
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

  updateSelectSalary(salarySelected: SalaryPayroll, event: boolean) {
    this.dialog.open(ClassifyOvertimeComponent, {
      data: {
        title: 'Chọn loại lương cơ bản',
        type: event ? "SELECT" : "REMOVE",
        salary: salarySelected.salary
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

  getTemplateBasic(branch?: string, position?: string) {
    this.payrollService.getAllTempLate({
      branch: branch || '',
      position: position || '',
      startedAt: this.getRangeDay().start,
      endedAt: this.getRangeDay().end,
      salaryType: SalaryTypeEnum.BASIC
    }).subscribe(val => this.templateBasic = val)
  }

  getRangeDay(): RangeDay {
    return getSelectors<RangeDay>(selectedRangeDayPayroll, this.store)
  }
}
