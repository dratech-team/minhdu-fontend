import {
  Component,
  Input,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  SalaryTypeEnum,
  SearchTypeEnum
} from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import {
  selectedAddingPayroll,
  selectedBranchPayroll,
  selectedCreateAtPayroll, selectedLoadedPayroll,
  selectedPositionPayroll, selectedTotalOvertimePayroll, selectedTotalPayroll, selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../../template/+state/template-overtime/template-overtime.action';
import { DatePipe } from '@angular/common';
import {
  getFirstDayInMonth,
  getLastDayInMonth
} from '../../../../../../../../libs/utils/daytime.until';
import { OvertimeService } from '../../service/overtime.service';
import {
  Api,
  SearchTypeConstant,
  UnitsConstant
} from '@minhdu-fontend/constants';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { DialogOvertimeMultipleComponent } from '../dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { getSelectors } from '../../../../../../../../libs/utils/getState.ultils';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { SalaryService } from '../../service/salary.service';
import { PayrollSalary } from '../../../../../../../../libs/data-models/hr/salary/payroll-salary';
import { Employee, Salary, SalaryPayroll } from '@minhdu-fontend/data-models';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { UpdateOvertimeMultiple } from '../update-overtime-multiple/update-overtime-multiple';
import { DialogExportComponent } from '../../../../../../../../libs/components/src/lib/dialog-export/dialog-export.component';
import { ExportService } from '@minhdu-fontend/service';
import { DialogOvertimeComponent } from '../dialog-salary/dialog-overtime/dialog-overtime.component';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {
  getAllPosition,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';
import * as moment from 'moment';

@Component({
  selector: 'app-payroll-overtime',
  templateUrl: 'payroll-overtime.component.html'
})
export class PayrollOvertimeComponent implements OnInit {
  @Input() eventAddOvertime?: Subject<any>;
  @Input() eventExportOvertime?: Subject<boolean>;
  @Input() overtimeTitle?: string;
  @Input() createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
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
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  totalOvertime$ = this.store.pipe(select(selectedTotalOvertimePayroll));
  pageType = PageTypeEnum;
  salaryType = SalaryTypeEnum;
  pageSize = 30;
  pageIndex = 0;
  pageIndexInit = 0;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  salariesSelected: SalaryPayroll[] = [];
  // overtime$ = this.store.pipe(select(selectorOvertime));
  // loaded$ = this.store.pipe(select(selectedLoadedSalary));
  payrollOvertime$ = this.store.pipe(select(selectorAllPayroll));
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  searchTypeConstant = SearchTypeConstant;
  unitsConstant = UnitsConstant;
  isSelectSalary = false;
  salaries: SalaryPayroll[] = [];
  isEventSearch = false;
  loaded$ = this.store.select(selectedLoadedPayroll);
  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly salaryService: SalaryService,
    private readonly exportService: ExportService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    let paramLoadInit = {
      take: this.pageSize,
      skip: this.pageIndex,
      salaryType: SalaryTypeEnum.OVERTIME,
      filterType:  FilterTypeEnum.SALARY,
      position: getSelectors<string>(selectedPositionPayroll, this.store),
      branch: getSelectors<string>(selectedBranchPayroll, this.store)
    };

    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );

    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate({}));

    this.templateOvertime$ = combineLatest([
      this.formGroup.get('title')!.valueChanges.pipe(startWith('')),
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
      this.formGroup
        .get('title')!
        .setValue(this.overtimeTitle);
      this.formGroup
        .get('startedAt')!
        .setValue(
          this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM-dd')
        );
      this.formGroup
        .get('endedAt')!
        .setValue(
          this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM-dd')
        );
    }else{
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
        this.formGroup.get('title')!.setValue(val.overtimeTitle);
      }
      this.formGroup
        .get('startAt')!
        .setValue(
          this.datePipe.transform(new Date(val.createdAt), 'yyyy-MM-dd')
        );
      this.formGroup
        .get('endAt')!
        .setValue(
          this.datePipe.transform(new Date(val.createdAt), 'yyyy-MM-dd')
        );
    });

    this.eventExportOvertime?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const overtime = {
          searchType: value.searchType,
          code: value.code,
          startedAt: new Date(value.startAt),
          endedAt: new Date(value.endAt),
          title: value.title || '',
          name: value.name || '',
          filename: val,
          exportType: FilterTypeEnum.OVERTIME,
          position: value.position,
          branch: value.branch
        };
        if (value.startedAt && value.endedAt) {
          if (
            moment(value.startedAt).format('YYYY-MM-DD') ===
            moment(value.endedAt).format('YYYY-MM-DD')
          ) {
            Object.assign(overtime, { createdAt: value.startedAt });
          } else {

            Object.assign(overtime, {
              startedAt: value.startedAt,
              endedAt: value.endedAt
            });
          }
        }
        console.log('ssss')
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuất Bảng tăng ca',
            params: overtime,
            exportType: FilterTypeEnum.OVERTIME,
            api: Api.HR.PAYROLL.PAYROLL
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
        if(payrolls.length === 0){
          this.isSelectSalary = false
        }
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (
                salary.type === SalaryTypeEnum.OVERTIME
              ) {
                if (this.isEventSearch) {
                  this.isSelectSalary = this.salariesSelected.length > 0
                    && this.salariesSelected.length >= Number(getSelectors(selectedTotalPayroll, this.store))
                    && this.salaries.every(item => this.salariesSelected.some(val => val.salary.id === item.salary.id));
                }
                if (
                  this.isSelectSalary &&
                  !this.salariesSelected.some(item => item.salary.id === salary.id) &&
                  !this.salaries.find((e) => e.salary.id === salary.id)
                ) {
                  this.salariesSelected.push({ salary: salary, employee: payroll.employee });
                }
                this.salaries.push({ salary: salary, employee: payroll.employee });
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
      title: value.title ? value.title : '',
      name: value.name,
      unit: value.unit? value.unit:'',
      salaryType: SalaryTypeEnum.OVERTIME,
      filterType: FilterTypeEnum.SALARY,
      position: value.position,
      branch: value.branch
    };
    if (
      moment(value.startedAt).format('YYYY-MM-DD') ===
      moment(value.endedAt).format('YYYY-MM-DD')
    ) {
      Object.assign(params, { createdAt: this.datePipe.transform(value.startedAt,'YYYY-MM-dd') });
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
      this.formGroup.get('title')!.patchValue(title);
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
        this.formGroup
          .get('startAt')!
          .setValue(new Date(val.datetime), 'yyyy-MM-dd');
        this.formGroup
          .get('endAt')!
          .setValue(new Date(val.datetime), 'yyyy-MM-dd');
        this.formGroup.get('title')!.setValue(val.title);
      }
    });
  }

  updateMultipleSalaryOvertime(): any {
    if (
      this.salariesSelected.every(function(value, index, array) {
        return value.salary.title === array[0].salary.title
          && value.salary.datetime === array[0].salary.datetime
          ;
      })
    ) {
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
            : this.formGroup.get('startAt')!.value,
          salariesSelected: this.salariesSelected,
          updateMultiple: true,
          isUpdate: true
        }
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.isSelectSalary = this.salaries.length > 0
          && this.salaries.every(e => this.salariesSelected.some(item => item.salary.id === e.salary.id));
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
          this.salariesSelected = [];
          this.formGroup.get('title')!.setValue(val.title);
          this.formGroup
            .get('startedAt')!
            .setValue(new Date(val.datetime), 'yyyy-MM-dd');
          this.formGroup
            .get('endedAt')!
            .setValue(new Date(val.datetime), 'yyyy-MM-dd');
        }
      });
    } else {
      this.snackbar.open('chưa chọn cùng loại  tăng ca', 'Đóng');
    }
  }

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
    return someComplete(this.salaries, this.salariesSelected, this.isSelectSalary);
  }

  setAllSalary(select: boolean) {
    this.isSelectSalary = setAll(select, this.salaries, this.salariesSelected);
  }

  detailPayroll(id: number) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', id]).then();
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
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
}
