import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api, SearchTypeConstant } from '@minhdu-fontend/constants';
import {
  Branch,
  Position,
  RangeDay,
  Salary,
  SalaryPayroll,
} from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  ItemContextMenu,
  SalaryTypeEnum,
  SearchTypeEnum,
  sortEmployeeTypeEnum,
} from '@minhdu-fontend/enums';
import { OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedEmpStatusPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedRangeDayPayroll,
  selectedTotalPayroll,
  selectorAllPayroll,
} from '../../+state/payroll/payroll.selector';
import { getAllPosition } from '@minhdu-fontend/orgchart-position';
import {
  checkInputNumber,
  filterSalaryPayroll,
  getSelectors,
  updateSelectOneSalaryPayroll,
} from '@minhdu-fontend/utils';
import { AppState } from '../../../../reducers';
import { SalaryService } from '../../service/salary.service';
import { DialogStayComponent } from '../dialog-salary/dialog-stay/dialog-stay.component';
import {
  DialogDeleteComponent,
  DialogExportComponent,
} from '@minhdu-fontend/components';
import { MatSort } from '@angular/material/sort';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PayrollService } from '../../service/payroll.service';
import { ExportService } from '@minhdu-fontend/service';
import { ClassifyOvertimeComponent } from '../classify-overtime/classify-overtime.component';

@Component({
  selector: 'app-payroll-stay',
  templateUrl: 'payroll-stay.component.html',
})
export class PayrollStayComponent implements OnInit, OnChanges {
  ItemContextMenu = ItemContextMenu;
  @Input() eventExportStay?: Subject<boolean>;
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectEmpStatus?: number;
  @Input() eventSelectRangeDay = new Subject<boolean>();
  @ViewChild(MatSort) sort!: MatSort;

  formGroup = new UntypedFormGroup({
    titles: new UntypedFormControl([]),
    code: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    empStatus: new UntypedFormControl(
      getSelectors<number>(selectedEmpStatusPayroll, this.store)
    ),
    searchType: new UntypedFormControl(SearchTypeEnum.CONTAINS),
    position: new UntypedFormControl(
      getSelectors(selectedPositionPayroll, this.store)
    ),
    branch: new UntypedFormControl(
      getSelectors(selectedBranchPayroll, this.store)
    ),
  });
  totalSalaryStay$ = this.store.select(selectedTotalPayroll);
  searchTypeConstant = SearchTypeConstant;
  loaded$ = this.store.select(selectedLoadedPayroll);
  genderType = Gender;
  unit = DatetimeUnitEnum;
  payrollStay$ = this.store.pipe(select(selectorAllPayroll));
  salariesSelected: SalaryPayroll[] = [];
  salaries: SalaryPayroll[] = [];
  pageSize = 30;
  pageIndex = 0;
  positions$ = this.store.pipe(select(getAllPosition));
  isEventSearch = false;
  sortEnum = sortEmployeeTypeEnum;
  templateStays: string[] = [];
  loadingDelete = false;
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
    private exportService: ExportService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.eventSearchBranch?.currentValue !==
      changes.eventSearchBranch?.previousValue
    ) {
      this.formGroup
        .get('branch')
        ?.patchValue(changes.eventSearchBranch.currentValue);
    }
    if (
      changes.eventSelectEmpStatus?.currentValue !==
      changes.eventSelectEmpStatus?.previousValue
    ) {
      this.formGroup
        .get('empStatus')
        ?.setValue(changes.eventSelectEmpStatus.currentValue);
    }
  }

  ngOnInit() {
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          take: this.pageSize,
          skip: this.pageIndex,
          startedAt: this.getRangeDay().start,
          endedAt: this.getRangeDay().end,
          filterType: FilterTypeEnum.STAY,
          position:
            getSelectors<Position>(selectedPositionPayroll, this.store)?.name ||
            '',
          branch:
            getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
          empStatus: getSelectors<number>(selectedEmpStatusPayroll, this.store),
        },
      })
    );

    this.store.dispatch(OrgchartActions.init());

    this.getTemplateStay(
      getSelectors<Branch>(selectedBranchPayroll, this.store)?.name,
      getSelectors<Position>(selectedPositionPayroll, this.store)?.name
    );

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.getTemplateStay(value.branch?.name, value.position?.name);
      this.store.dispatch(
        PayrollAction.updateStatePosition({ position: value.position })
      );
      this.store.dispatch(
        PayrollAction.loadInit({ payrollDTO: this.mapPayrollStay() })
      );
    });

    this.payrollStay$.subscribe((payrolls) => {
      if (payrolls) {
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (salary.type === SalaryTypeEnum.STAY) {
                this.salaries.push({ salary, payroll: payroll });
                if (
                  filterSalaryPayroll(this.salariesSelected, salary).length >
                    0 &&
                  this.salariesSelected.every(
                    (salaryPayroll) => salaryPayroll.salary.id !== salary.id
                  )
                ) {
                  this.salariesSelected.push({ salary, payroll });
                }
              }
            });
          }
        });
      }
    });

    this.eventExportStay?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollStay = {
          code: value.code || '',
          name: value.name,
          position: value.position?.name || '',
          branch: value.branch.name || '',
          exportType: FilterTypeEnum.STAY,
          titles: value.titles,
          empStatus: value.empStatus,
          startedAt: this.getRangeDay().start,
          endedAt: this.getRangeDay().end,
        };
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            filename: `Xuất bản phụ cấp lương từ ngày ${this.datePipe.transform(
              payrollStay.startedAt,
              'MM-yyyy'
            )} đến ngày ${this.datePipe.transform(
              payrollStay.endedAt,
              'MM-yyyy'
            )}`,
            title: 'Xuât bảng phụ cấp lương',
            params: payrollStay,
            selectDatetime: true,
            api: Api.HR.PAYROLL.EXPORT,
          },
        });
      }
    });

    this.eventSelectRangeDay.subscribe((val) => {
      if (val) {
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: this.mapPayrollStay(),
          })
        );
      }
    });
  }

  readPayroll(event: any) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', event.id]).then();
  }

  addSalaryStay(salary: Salary) {
    const ref = this.dialog.open(DialogStayComponent, {
      width: 'fit-content',
      data: {
        addMultiple: true,
        salary: salary,
        createdAt: this.getRangeDay().start,
        type: SalaryTypeEnum.STAY,
        selectEmp: true,
      },
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        //ở v2 khi thêm thành công sẽ search theo title của salary stay vừa tạo nhưng back end chưa xử lý nên frontend  đang tạm ẩn
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: this.mapPayrollStay(),
          })
        );
      }
    });
  }

  updateMultipleSalaryStay() {
    if (
      this.salariesSelected.every((value, index, array) => {
        return value.salary.title === array[0].salary.title;
      })
    ) {
      const ref = this.dialog.open(DialogStayComponent, {
        width: 'fit-content',
        data: {
          isUpdate: true,
          salary: this.salariesSelected[0].salary,
          salariesSelected: this.salariesSelected,
          updateMultiple: true,
        },
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
          this.salariesSelected = [];
          this.formGroup
            .get('titles')
            ?.setValue([val.title], { emitEvent: false });
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: this.mapPayrollStay(),
            })
          );
        }
      });
    } else {
      this.message.error('chưa chọn cùng loại lương');
    }
  }

  deleteMultipleSalaryStay() {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content',
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.loadingDelete = true;
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
            this.loadingDelete = false;
            this.salariesSelected = [];
            this.message.success('Xóa phụ cấp lương thành công');
            this.store.dispatch(
              PayrollAction.loadInit({ payrollDTO: this.mapPayrollStay() })
            );
          }
        });
      }
    });
  }

  deleteSalaryStay(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content',
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.message.success('Xóa phiếu lương thành công');
            this.store.dispatch(
              PayrollAction.loadInit({
                payrollDTO: this.mapPayrollStay(),
              })
            );
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
        payrollDTO: this.mapPayrollStay(),
      })
    );
  }

  updateSelectSalary(salaryPayroll: SalaryPayroll, event: boolean) {
    this.dialog
      .open(ClassifyOvertimeComponent, {
        data: {
          title: 'Chọn loại phụ cấp',
          type: event ? 'SELECT' : 'REMOVE',
          salary: salaryPayroll.salary,
        },
      })
      .afterClosed()
      .subscribe((type) => {
        if (type === 'ALL') {
          if (event) {
            this.salariesSelected = [
              ...filterSalaryPayroll(this.salaries, salaryPayroll.salary),
            ];
          } else {
            filterSalaryPayroll(this.salaries, salaryPayroll.salary).forEach(
              (val) => {
                const index = this.salariesSelected.findIndex(
                  (value) => value.salary.id === val.salary.id
                );
                this.salariesSelected.splice(index, 1);
              }
            );
          }
        } else {
          updateSelectOneSalaryPayroll(
            event,
            salaryPayroll,
            this.salariesSelected
          );
        }
      });
  }

  mapPayrollStay() {
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
      filterType: FilterTypeEnum.STAY,
      position: value.position?.name || '',
      branch: value.branch.name || '',
      empStatus: value.empStatus,
    };
    if (this.sort?.active) {
      Object.assign(params, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction : '',
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
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: this.mapPayrollStay(),
      })
    );
  }

  getTemplateStay(branch?: string, position?: string) {
    this.payrollService
      .getAllTempLate({
        branch: branch || '',
        position: position || '',
        startedAt: this.getRangeDay().start,
        endedAt: this.getRangeDay().end,
        salaryType: SalaryTypeEnum.STAY,
      })
      .subscribe((val) => (this.templateStays = val));
  }

  getRangeDay(): RangeDay {
    return getSelectors<RangeDay>(selectedRangeDayPayroll, this.store);
  }
}
