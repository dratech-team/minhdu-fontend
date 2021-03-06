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
import { ActivatedRoute, Router } from '@angular/router';
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
  GenderTypeEnum,
  ItemContextMenu,
  SalaryTypeEnum,
  SearchTypeEnum,
  sortEmployeeTypeEnum,
} from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedAddingPayroll,
  selectedBranchPayroll,
  selectedEmpStatusPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedRangeDayPayroll,
  selectedTotalOvertimePayroll,
  selectorAllPayroll,
} from '../../+state/payroll/payroll.selector';
import {
  DialogDeleteComponent,
  DialogExportComponent,
} from '@minhdu-fontend/components';
import { getAllPosition } from '@minhdu-fontend/orgchart-position';
import {
  checkInputNumber,
  filterSalaryPayroll,
  getSelectors,
} from '@minhdu-fontend/utils';
import { AppState } from '../../../../reducers';
import { SalaryService } from '../../service/salary.service';
import { DialogOvertimeMultipleComponent } from '../dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { DialogOvertimeComponent } from '../dialog-salary/dialog-overtime/dialog-overtime.component';
import { MatSort } from '@angular/material/sort';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PayrollService } from '../../service/payroll.service';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { ExportService } from '@minhdu-fontend/service';
import { ClassifyOvertimeComponent } from '../classify-overtime/classify-overtime.component';

@Component({
  selector: 'minhdu-fontend-payroll-overtime',
  templateUrl: 'payroll-overtime.component.html',
})
export class PayrollOvertimeComponent implements OnInit, OnChanges {
  @Input() eventAddOvertime?: Subject<any>;
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectEmpStatus?: number;
  @Input() eventExportOvertime?: Subject<boolean>;
  @Input() overtimeTitle?: string;
  @Input() eventSelectRangeDay = new Subject<boolean>();
  @ViewChild(MatSort) sort!: MatSort;

  ItemContextMenu = ItemContextMenu;
  salaryType = SalaryTypeEnum;
  pageSize = 30;
  pageIndex = 0;
  pageIndexInit = 0;
  genderType = GenderTypeEnum;
  unit = DatetimeUnitEnum;
  salariesSelected: Array<SalaryPayroll> = [];
  salaries: Array<SalaryPayroll> = [];
  searchTypeConstant = SearchTypeConstant;
  isEventSearch = false;
  sortEnum = sortEmployeeTypeEnum;
  loadingDelete = false;
  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollOvertime$ = this.store.pipe(select(selectorAllPayroll));
  templateOvertime: string[] = [];
  positions$ = this.store.pipe(select(getAllPosition));
  totalOvertime$ = this.store.pipe(select(selectedTotalOvertimePayroll));
  adding$ = this.store.pipe(select(selectedAddingPayroll));

  formGroup = new UntypedFormGroup({
    titles: new UntypedFormControl([]),
    code: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    empStatus: new UntypedFormControl(
      getSelectors<number>(selectedEmpStatusPayroll, this.store)
    ),
    position: new UntypedFormControl(
      getSelectors(selectedPositionPayroll, this.store)
    ),
    branch: new UntypedFormControl(
      getSelectors(selectedBranchPayroll, this.store)
    ),
    searchType: new UntypedFormControl(SearchTypeEnum.CONTAINS),
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
    private readonly exportService: ExportService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.eventSearchBranch?.currentValue !==
      changes.eventSearchBranch?.previousValue
    ) {
      this.formGroup
        .get('branch')
        ?.setValue(changes.eventSearchBranch.currentValue);
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
    const paramLoadInit = {
      take: this.pageSize,
      skip: this.pageIndex,
      filterType: FilterTypeEnum.OVERTIME,
      position:
        getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
      branch:
        getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
      empStatus: getSelectors<number>(selectedEmpStatusPayroll, this.store),
    };
    this.activeRouter.queryParams.subscribe((val) => {
      if (val.titleOvertime) {
        this.formGroup
          .get('titles')
          ?.setValue([val.titleOvertime], { emitEvent: false });
        Object.assign(paramLoadInit, { titles: [val.titleOvertime] });
      }
    });

    this.getTemplateOvertime(
      getSelectors<Branch>(selectedBranchPayroll, this.store)?.name,
      getSelectors<Position>(selectedPositionPayroll, this.store)?.name
    );

    if (this.overtimeTitle) {
      this.formGroup.get('titles')?.setValue([this.overtimeTitle]);
    }

    Object.assign(paramLoadInit, {
      startedAt: getSelectors<RangeDay>(selectedRangeDayPayroll, this.store)
        .start,
      endedAt: getSelectors<RangeDay>(selectedRangeDayPayroll, this.store).end,
    });

    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: paramLoadInit,
      })
    );

    this.eventAddOvertime?.subscribe((val) => {
      if (val.overtimeTitle) {
        this.formGroup.get('titles')?.setValue([val.overtimeTitle]);
      }
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
          startedAt: this.getRangeDay().start,
          endedAt: this.getRangeDay().end,
        };
        if (value.name) {
          Object.assign(overtime, { name: value.name });
        }
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            filename:
              overtime.titles.length > 0
                ? overtime.titles.join(' + ')
                : `Xu???t b???ng t??ng ca t??? ng??y  ${this.datePipe.transform(
                    overtime.startedAt,
                    'dd-MM-yyyy'
                  )} ?????n ng??y ${this.datePipe.transform(
                    overtime.endedAt,
                    'dd-MM-yyyy'
                  )}`,
            title: 'Xu???t B???ng t??ng ca',
            params: overtime,
            typeDate: 'RANGE_DATETIME',
            selectDatetime: true,
            api: Api.HR.PAYROLL.EXPORT,
          },
        });
      }
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.getTemplateOvertime(value.branch?.name, value.position?.name);
      this.isEventSearch = true;
      this.store.dispatch(
        PayrollAction.updateStatePosition({ position: value.position })
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollOvertime(),
        })
      );
    });

    this.payrollOvertime$.subscribe((payrolls) => {
      if (payrolls) {
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (salary.type === SalaryTypeEnum.OVERTIME) {
                this.salaries.push({ salary: salary, payroll: payroll });
                if (
                  filterSalaryPayroll(this.salariesSelected, salary).length >
                    0 &&
                  this.salariesSelected.every(
                    (salaryPayroll) => salaryPayroll.salary.id !== salary.id
                  )
                ) {
                  this.salariesSelected.push({
                    salary: salary,
                    payroll: payroll,
                  });
                }
              }
            });
          }
        });
      }
    });

    this.eventSelectRangeDay.pipe(debounceTime(100)).subscribe((val) => {
      if (val) {
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: this.mapPayrollOvertime(),
          })
        );
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
      empStatus: value.empStatus,
      startedAt: this.getRangeDay().start,
      endedAt: this.getRangeDay().end,
    };
    if (this.sort.active) {
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

  addSalaryOvertime(salary: Salary) {
    const ref = this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: {
        salary: salary,
        type: SalaryTypeEnum.OVERTIME,
      },
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          PayrollAction.updateStatePayroll({
            rangeDay: {
              start: new Date(val.datetime),
              end: new Date(val.datetime),
            },
          })
        );
        this.formGroup.get('titles')?.setValue(val.title);
      }
    });
  }

  updateMultipleSalaryOvertime(): any {
    const uniq = _.uniqWith(this.mapSalary(this.salariesSelected), _.isEqual);
    if (uniq.length === 1) {
      // if (!this.salariesSelected[0].salary.unit) {
      //   return this.message.success('Kh??ng s???a l????ng t??y ch???n cho nhi???u nh??n vi??n ???????c');
      // }
      const ref = this.dialog.open(DialogOvertimeComponent, {
        width: 'fit-content',
        data: {
          type: SalaryTypeEnum.OVERTIME,
          salary: this.salariesSelected[0].salary,
          payroll: this.salariesSelected[0].payroll,
          createdAt: this.salariesSelected[0].salary?.datetime
            ? this.salariesSelected[0].salary?.datetime
            : this.formGroup.get('startAt')?.value,
          salariesSelected: this.salariesSelected,
          updateMultiple: true,
          isUpdate: true,
        },
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val: { title: string; datetime: Date }) => {
        if (val) {
          this.salariesSelected = [];
          this.store.dispatch(
            PayrollAction.updateStatePayroll({
              rangeDay: {
                start: new Date(val.datetime),
                end: new Date(val.datetime),
              },
            })
          );
          this.formGroup
            .get('titles')
            ?.setValue([val.title], { emitEvent: false });
          this.store.dispatch(
            PayrollAction.loadInit({ payrollDTO: this.mapPayrollOvertime() })
          );
        }
      });
    } else {
      const uniqTitle = [...new Set(uniq.map(({ title }) => title))];
      const uniqDatetime = [
        ...new Set(
          uniq.map(({ datetime }) => moment(datetime).format('DD/MM/YYYY'))
        ),
      ];
      const uniqPrice = [...new Set(uniq.map(({ price }) => price))];
      const uniqUnit = [...new Set(uniq.map(({ unit }) => unit))];

      /// v2 ???? gi???i quy???t
      // const uniqAllowance = [
      //   ...new Set(uniq.map(({ allowance }) => allowance)),
      // ];

      // ${
      //   uniqAllowance.length > 1
      //     ? 'ph??? c???p t??ng ca: ' + uniqAllowance.join(', ') + ', '
      //     : ''
      // }

      this.message.error(
        `S???a ?????i h??ng lo???t ph???i gi???ng nhau v??? Lo???i t??ng ca, ????n v??? t??nh, ????n gi?? v?? ng??y t??ng ca. M???c ??ang b??? sai:
         ${
           uniqTitle.length > 1
             ? ' lo???i t??ng ca: ' + uniqTitle.join(' + ') + `` + ', '
             : ''
         } ${
          uniqUnit.length > 1
            ? '????n v??? t??nh: ' + uniqUnit.join(' + ') + ', '
            : ''
        } ${
          uniqPrice.length > 1 ? '????n gi??: ' + uniqPrice.join(' + ') + ', ' : ''
        } ${
          uniqDatetime.length > 1
            ? 'ng??y t??ng ca: ' + uniqDatetime.join(' + ') + ', '
            : ''
        }`
      );
    }
  }

  // v2 ???? gi???i quy???t
  mapSalary = (salaries: any[]) =>
    salaries.map(({ salary }) => ({
      title: salary.title,
      datetime: salary.datetime,
      forgot: salary.forgot,
      price: salary.price,
      rate: salary.rate,
      type: salary.type,
      unit: salary.unit,
      // allowance: {
      //   title: salary?.allowance?.title,
      //   price: salary?.allowance?.price,
      // },
    }));

  deleteMultipleSalaryOvertime(): any {
    this.dialog
      .open(DialogDeleteComponent, {
        width: 'fit-content',
      })
      .afterClosed()
      .subscribe((value) => {
        const deleteSuccess = new Subject<number>();
        if (value) {
          this.loadingDelete = true;
          this.salariesSelected.forEach((salary, index) => {
            this.salaryService.delete(salary.salary.id).subscribe((_) => {
              deleteSuccess.next(index);
            });
          });
          deleteSuccess.subscribe((val) => {
            this.loadingDelete = false;
            if (val === this.salariesSelected.length - 1) {
              this.message.success('X??a t??ng ca th??nh c??ng');
              this.salariesSelected = [];
              this.store.dispatch(
                PayrollAction.loadInit({
                  payrollDTO: this.mapPayrollOvertime(),
                })
              );
            }
          });
        }
      });
  }

  deleteSalaryOvertime(event: any) {
    this.dialog
      .open(DialogDeleteComponent, {
        width: 'fit-content',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          const value = this.formGroup.value;
          const payrollOvertime = {
            searchType: value.searchType,
            startedAt: this.getRangeDay().start,
            endedAt: this.getRangeDay().end,
            titles: value.titles ? value.titles : [],
            name: value.name,
            position: value.position?.name || '',
            branch: value.branch.name,
          };
          if (!value.name) {
            delete payrollOvertime.name;
          }
          this.salaryService.delete(event.id).subscribe((val: any) => {
            if (val) {
              this.message.success('X??a phi???u l????ng th??nh c??ng');
              this.store.dispatch(
                PayrollAction.loadInit({
                  payrollDTO: this.mapPayrollOvertime(),
                })
              );
            }
          });
        }
      });
  }

  updateSelectSalary(salary: Salary, payroll: Payroll, event: boolean) {
    this.dialog
      .open(ClassifyOvertimeComponent, {
        data: {
          title: 'Ch???n lo???i t??ng ca',
          type: event ? 'SELECT' : 'REMOVE',
          salary,
        },
      })
      .afterClosed()
      .subscribe((type) => {
        if (type === 'ALL') {
          if (event) {
            this.salariesSelected = [
              ...filterSalaryPayroll(this.salaries, salary),
            ];
          } else {
            filterSalaryPayroll(this.salaries, salary).forEach((val) => {
              const index = this.salariesSelected.findIndex(
                (value) => value.salary.id === val.salary.id
              );
              this.salariesSelected.splice(index, 1);
            });
          }
        } else {
          if (event) {
            this.salariesSelected.push({ salary, payroll });
          } else {
            const index = this.salariesSelected.findIndex(
              (value) => value.salary.id === salary.id
            );
            this.salariesSelected.splice(index, 1);
          }
        }
      });
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

  isSame = (payroll: Payroll) =>
    payroll.salaries.some((salary) =>
      this.salariesSelected.some((e) => e.salary.id === salary.id)
    );

  onScroll() {
    this.isEventSearch = false;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollOvertime(),
      })
    );
  }

  sortPayroll() {
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: this.mapPayrollOvertime(),
      })
    );
  }

  getTemplateOvertime(branch?: string, position?: string) {
    this.payrollService
      .getAllTempLate({
        branch: branch || '',
        position: position || '',
        startedAt: this.getRangeDay().start,
        endedAt: this.getRangeDay().end,
        salaryType: SalaryTypeEnum.OVERTIME,
      })
      .subscribe((value) => (this.templateOvertime = value));
  }

  getRangeDay(): RangeDay {
    return getSelectors<RangeDay>(selectedRangeDayPayroll, this.store);
  }
}
