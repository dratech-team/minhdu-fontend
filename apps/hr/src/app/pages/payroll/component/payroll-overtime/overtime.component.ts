import { Component, Input, EventEmitter, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatetimeUnitEnum, Gender, PayrollEnum, SalaryTypeEnum, SearchTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import {
  selectedAddingPayroll, selectedBranchPayroll, selectedCreateAtPayroll
} from '../../+state/payroll/payroll.selector';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import {
  TemplateOvertimeAction
} from '../../../template/+state/template-overtime/template-overtime.action';
import { DatePipe } from '@angular/common';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { OvertimeService } from '../../service/overtime.service';
import { Api, SearchTypeConstant, UnitsConstant } from '@minhdu-fontend/constants';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { DialogOvertimeMultipleComponent } from '../dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { getState } from '../../../../../../../../libs/utils/getState.ultils';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { SalaryService } from '../../service/salary.service';
import { PayrollSalary } from '../../../../../../../../libs/data-models/hr/salary/payroll-salary';
import { Salary } from '@minhdu-fontend/data-models';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { UpdateOvertimeMultiple } from '../update-overtime-multiple/update-overtime-multiple';
import { DialogExportComponent } from '../dialog-export/dialog-export.component';
import { ExportService } from '@minhdu-fontend/service';

@Component({
  selector: 'app-payroll-overtime',
  templateUrl: 'overtime.component.html'
})
export class OvertimeComponent implements OnInit {
  @Input() eventAddOvertime?: Subject<any>;
  @Input() eventExportOvertime?: Subject<boolean>;
  @Input() overtimeTitle?: string;
  createdAt = getState(selectedCreateAtPayroll, this.store);
  formGroup = new FormGroup({
    title: new FormControl(''),
    name: new FormControl(''),
    startAt: new FormControl(),
    endAt: new FormControl(),
    searchType: new FormControl(SearchTypeEnum.CONTAINS)
  });

  salaryIds: number[] = [];
  pageType = PageTypeEnum;
  salaryType = SalaryTypeEnum;
  pageSize: number = 30;
  pageIndexInit = 0;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  overtime!: PayrollSalary;
  salariesSelected: Salary[] = [];
  // overtime$ = this.store.pipe(select(selectorOvertime));
  // loaded$ = this.store.pipe(select(selectedLoadedSalary));
  loaded = false;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  searchTypeConstant = SearchTypeConstant;
  unitsConstant = UnitsConstant;
  isSelectSalary = false;
  salaries: Salary[] = [];

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly salaryService: SalaryService,
    private readonly exportService: ExportService
  ) {
  }

  ngOnInit() {
    this.overtimeService.getOvertime(
      {
        title: this.overtimeTitle ? this.overtimeTitle : '',
        searchType: SearchTypeEnum.CONTAINS,
        startAt: this.overtimeTitle ? new Date(this.createdAt) : getFirstDayInMonth(new Date(this.createdAt)),
        endAt: this.overtimeTitle ? new Date(this.createdAt) : getLastDayInMonth(new Date(this.createdAt))
      }
    ).subscribe(val => {
      this.loaded = true;
      val.employees.forEach(employee => this.salaries = this.salaries.concat(employee.salaries));
      this.overtime = val;
    });

    this.formGroup.get('startAt')!.setValue(this.datePipe.transform(
      !this.overtimeTitle ?
        getFirstDayInMonth(this.createdAt)
        : new Date(this.createdAt), 'yyyy-MM-dd'));
    this.formGroup.get('endAt')!.setValue(this.datePipe.transform(
      !this.overtimeTitle ?
        getLastDayInMonth(this.createdAt)
        : new Date(this.createdAt)
      , 'yyyy-MM-dd'));

    if (this.overtimeTitle) {
      this.formGroup.get('title')!.setValue(this.overtimeTitle, { emitEvent: false });
    }

    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate({}));

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        if ((value.startAt && value.endAt)) {
          this.store.dispatch(PayrollAction.updateStatePayroll({ createdAt: new Date(value.startAt) }));
          this.loaded = false;
          const params = {
            searchType: value.searchType,
            startAt: new Date(value.startAt),
            endAt: new Date(value.endAt),
            title: value.title,
            name: value.name
          };
          if (!value.name) {
            delete params.name;
          }
          this.isSelectSalary = false;
          this.salaryIds = [];
          this.salaries = [];
          this.overtimeService.getOvertime(params).subscribe(val => {
            this.loaded = true;
            val.employees.forEach(employee => this.salaries = this.salaries.concat(employee.salaries));
            return this.overtime = val;
          });
        }
      }
    );

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

    this.eventAddOvertime?.subscribe(val => {
      if (this.overtimeTitle) {
        this.formGroup.get('title')!.setValue(val.overtimeTitle);
      }
      this.formGroup.get('startAt')!.setValue(this.datePipe.transform(new Date(val.createdAt), 'yyyy-MM-dd'));
      this.formGroup.get('endAt')!.setValue(this.datePipe.transform(new Date(val.createdAt), 'yyyy-MM-dd'));
      this.overtimeService.getOvertime(
        {
          title: val.overtimeTitle ? val.overtimeTitle : '',
          startAt: new Date(val.createdAt),
          endAt: new Date(val.createdAt)
        });
    });

    this.eventExportOvertime?.subscribe(val => {
      if (val) {
        const ref = this.dialog.open(DialogExportComponent, { width: 'fit-content' });
        ref.afterClosed().subscribe(val =>{
          if(val){
            const value = this.formGroup.value;
            const overtime = {
              searchType: value.searchType,
              startedAt: new Date(value.startAt),
              endedAt: new Date(value.endAt),
              title: value.title||'',
              name: value.name|| '',
              filename: val
            };
            this.exportService.print(
              Api.HR.PAYROLL.PAYROLL_EXPORT_OVERTIME, overtime
            );
          }
        })
      }
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.payrollId])
      .then();
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
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('startAt')!.setValue(new Date(val.datetime), 'yyyy-MM-dd');
        this.formGroup.get('endAt')!.setValue(new Date(val.datetime), 'yyyy-MM-dd');
        this.formGroup.get('title')!.setValue(val.title);
      }
    });
  }

  updateSalaryOvertime() {
    let salariesSelected: Salary[] = [];
    this.salaries.forEach(salary => {
      if (this.salaryIds.includes(salary.id)) {
        salariesSelected.push(salary);
      }
    });
    if (salariesSelected.every(function(value, index, array) {
      return value.title === array[0].title;
    })) {
      const ref = this.dialog.open(UpdateOvertimeMultiple, {
        width: 'fit-content',
        data: {
          unit: salariesSelected[0].unit,
          createdAt: this.formGroup.get('startAt')!.value,
          salaryIds: this.salaryIds
        }
      });
      ref.afterClosed().subscribe(val => {
        if (val) {
          this.salaryIds = [];
          this.formGroup.get('startAt')!.setValue(new Date(val.datetime), 'yyyy-MM-dd');
          this.formGroup.get('endAt')!.setValue(new Date(val.datetime), 'yyyy-MM-dd');
        }
      });
    } else {
      this.snackbar.open('chưa chọn cùng loại  tăng ca', 'Đóng');
    }
  }

  deleteSalaryOvertime(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        const value = this.formGroup.value;
        const payrollOvertime = {
          searchType: value.searchType,
          startAt: new Date(value.startAt),
          endAt: new Date(value.endAt),
          title: value.title,
          name: value.name
        };
        if (!value.name) {
          delete payrollOvertime.name;
        }
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.snackbar.open('Xóa phiếu lương thành công', '', { duration: 1500 });
            this.overtimeService.getOvertime(payrollOvertime).subscribe(val => {
              this.overtime = val;
            });
          }
        });
      }
    });
  }

  updateSelectSalary(id: number) {
    if (this.overtime) {
      this.isSelectSalary = updateSelect(id, this.salaryIds, this.isSelectSalary, this.salaries);
    }
  }

  someCompleteSalary(): boolean {
    if (!this.salaries) {
      return false;
    } else {
      return someComplete(this.salaries, this.salaryIds, this.isSelectSalary);
    }
  }

  setAllSalary(select: boolean) {
    if (this.overtime) {
      this.isSelectSalary = setAll(select, this.salaries, this.salaryIds);
    }
  }
}
