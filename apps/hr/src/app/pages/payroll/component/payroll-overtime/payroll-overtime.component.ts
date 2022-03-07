import { DatePipe } from '@angular/common';
import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Api, SearchTypeConstant } from '@minhdu-fontend/constants';
import { Employee, Salary, SalaryPayroll } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  ItemContextMenu,
  SalaryTypeEnum,
  SearchTypeEnum, sortTypeEnum
} from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, of, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
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
import { DialogDeleteComponent, DialogExportComponent } from '@minhdu-fontend/components';
import { getAllPosition, PositionActions } from '@minhdu-fontend/orgchart-position';
import {
  checkInputNumber,
  getFirstDayInMonth,
  getLastDayInMonth,
  getSelectors,
  searchAutocomplete
} from '@minhdu-fontend/utils';
import { AppState } from '../../../../reducers';
import { TemplateOvertimeAction } from '../../../template/+state/template-overtime/template-overtime.action';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import { SalaryService } from '../../service/salary.service';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { DialogOvertimeMultipleComponent } from '../dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { DialogOvertimeComponent } from '../dialog-salary/dialog-overtime/dialog-overtime.component';
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'minhdu-fontend-payroll-overtime',
  templateUrl: 'payroll-overtime.component.html'
})
export class PayrollOvertimeComponent implements OnInit {
  @Input() eventAddOvertime?: Subject<any>;
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
  sortEnum = sortTypeEnum

  loaded$ = this.store.select(selectedLoadedPayroll);
  payrollOvertime$ = this.store.pipe(select(selectorAllPayroll));
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  totalOvertime$ = this.store.pipe(select(selectedTotalOvertimePayroll));
  adding$ = this.store.pipe(select(selectedAddingPayroll));

  formGroup = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    startedAt: new FormControl(
      this.datePipe.transform(getFirstDayInMonth(this.createdAt), 'yyyy-MM-dd')
    ),
    endedAt: new FormControl(
      this.datePipe.transform(getLastDayInMonth(this.createdAt), 'yyyy-MM-dd')
    ),
    position: new FormControl(
      getSelectors(selectedPositionPayroll, this.store)
    ),
    branch: new FormControl(getSelectors(selectedBranchPayroll, this.store)),
    searchType: new FormControl(SearchTypeEnum.CONTAINS)
  });

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly salaryService: SalaryService,
    private readonly activeRouter: ActivatedRoute,
    private readonly ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    const paramLoadInit = {
      take: this.pageSize,
      skip: this.pageIndex,
      filterType: FilterTypeEnum.OVERTIME,
      position: getSelectors<string>(selectedPositionPayroll, this.store),
      branch: getSelectors<string>(selectedBranchPayroll, this.store)
    };
    this.activeRouter.queryParams.subscribe((val) => {
      if (val.titleOvertime) {
        this.formGroup.get('title')?.setValue(JSON.parse(JSON.stringify(val.titleOvertime)));
        Object.assign(paramLoadInit, { title: val.titleOvertime });
      }
    });
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );

    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate({}));

    this.templateOvertime$ = combineLatest([
      this.formGroup.get('title')?.valueChanges.pipe(startWith('')) || of(''),
      this.store.pipe(select(selectorAllTemplate))
    ]).pipe(
      map(([title, templateOvertimes]) => {
        if (title) {
          return templateOvertimes.filter((template) => {
            return template.title.toLowerCase().includes(title?.toLowerCase());
          });
        } else {
          return templateOvertimes;
        }
      })
    );

    if (this.overtimeTitle) {
      Object.assign(paramLoadInit, {
        createdAt: this.datePipe.transform(this.createdAt, 'yyyy-MM-dd')
      });
      this.formGroup.get('title')?.setValue(this.overtimeTitle);
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
        this.formGroup.get('title')?.setValue(val.overtimeTitle);
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
          title: value.title || '',
          filename: val,
          exportType: 'RANGE_DATETIME',
          position: value.position,
          branch: value.branch,
          startedAt: value.startedAt,
          endedAt: value.endedAt
        };
        if (value.name) {
          Object.assign(overtime, { name: value.name });
        }
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuất Bảng tăng ca',
            params: overtime,
            exportType: 'RANGE_DATETIME',
            isPayroll: true,
            api: Api.HR.PAYROLL.EXPORT
          }
        });
      }
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          createdAt: new Date(value.startedAt),
          position: value.position,
          branch: value.branch
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
                    employee: payroll.employee
                  });
                }
                this.salaries.push({
                  salary: salary,
                  employee: payroll.employee
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
      title: value?.title || '',
      name: value.name,
      unit: value?.unit || '',
      filterType: FilterTypeEnum.OVERTIME,
      position: value.position,
      branch: value.branch,
    };
    if(this.sort.active){
      Object.assign(params, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction === 'asc' ? 'UP' : 'DOWN' : '',
      })
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

  onSelectTemplateOvertime(event: any, title: string) {
    if (event.isUserInput) {
      this.formGroup.get('title')?.patchValue(title);
    }
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
    console.log(uniq, this.mapSalary(this.salariesSelected));
    if (uniq.length === 1) {
      if (!this.salariesSelected[0].salary.unit) {
        return this.snackbar.open(
          'Không sửa lương tùy chọn cho nhiều nhân viên được',
          'Đóng'
        );
      }
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
          this.formGroup.get('title')?.setValue(val.title);
          this.formGroup.get('startedAt')?.setValue(new Date(val.datetime), 'yyyy-MM-dd');
          this.formGroup.get('endedAt')?.setValue(new Date(val.datetime), 'yyyy-MM-dd');
        }
      });
    } else {
      const uniqTitle = [...new Set(uniq.map(({ title }) => title))];
      const uniqDatetime = [
        ...new Set(
          uniq.map(({ datetime }) => moment(datetime).format('DD/MM/YYYY'))
        )
      ];
      const uniqPrice = [...new Set(uniq.map(({ price }) => price))];
      const uniqUnit = [...new Set(uniq.map(({ unit }) => unit))];

      /// FIXME: Can validate allowance isEqual
      // const uniqAllowance = [
      //   ...new Set(uniq.map(({ allowance }) => allowance)),
      // ];

      // ${
      //   uniqAllowance.length > 1
      //     ? 'phụ cấp tăng ca: ' + uniqAllowance.join(', ') + ', '
      //     : ''
      // }

      this.snackbar.open(
        `Sửa đổi hàng loạt phải giống nhau về Loại tăng ca, đơn vị tính, đơn giá và ngày tăng ca. Mục đang bị sai:
         ${
          uniqTitle.length > 1
            ? ' loại tăng ca: ' + uniqTitle.join(', ') + `` + ', '
            : ''
        } ${
          uniqUnit.length > 1
            ? 'đơn vị tính: ' + uniqUnit.join(', ') + ', '
            : ''
        } ${
          uniqPrice.length > 1 ? 'đơn giá: ' + uniqPrice.join(', ') + ', ' : ''
        } ${
          uniqDatetime.length > 1
            ? 'ngày tăng ca: ' + uniqDatetime.join(', ') + ', '
            : ''
        }`,
        'Đã hiểu'
      );
    }
  }

  /// FIXME: Can validate allowance isEqual
  mapSalary = (salaries: any[]) =>
    salaries.map(({ salary }) => ({
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
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((value) => {
      const deleteSuccess = new Subject<number>();
      if (value) {
        this.salariesSelected.forEach((salary, index) => {
          this.salaryService.delete(salary.salary.id).subscribe((_) => {
            deleteSuccess.next(index);
          });
        });
        deleteSuccess.subscribe((val) => {
          if (val === this.salariesSelected.length - 1) {
            this.snackbar.open('Xóa tăng ca thành công', 'Đóng');
            this.salariesSelected = [];
            this.isSelectSalary = false;
            const value = this.formGroup.value;
            const payrollOvertime = {
              searchType: value.searchType,
              code: value.code,
              startAt: new Date(value.startAt),
              endAt: new Date(value.endAt),
              title: value.title,
              name: value.name,
              position: value.position,
              branch: value.branch
            };
            if (!value.name) {
              delete payrollOvertime.name;
            }
            this.store.dispatch(
              PayrollAction.loadInit({ payrollDTO: this.mapPayrollOvertime() })
            );
          }
        });
      }
    });
  }

  deleteSalaryOvertime(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollOvertime = {
          searchType: value.searchType,
          startAt: new Date(value.startAt),
          endAt: new Date(value.endAt),
          title: value.title,
          name: value.name,
          position: value.position,
          branch: value.branch
        };
        if (!value.name) {
          delete payrollOvertime.name;
        }
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.snackbar.open('Xóa phiếu lương thành công', '', {
              duration: 1500
            });
            this.store.dispatch(
              PayrollAction.loadInit({ payrollDTO: this.mapPayrollOvertime() })
            );
          }
        });
      }
    });
  }

  updateSelectSalary(salary: Salary, employee: Employee) {
    const salarySelected = { salary, employee };
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

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
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
      payrollDTO : this.mapPayrollOvertime()
    }))
  }

}
