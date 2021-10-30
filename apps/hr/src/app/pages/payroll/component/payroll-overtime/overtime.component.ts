import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatetimeUnitEnum, Gender, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import {
  selectedAddingPayroll
} from '../../+state/payroll/payroll.selector';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import {
  TemplateOvertimeAction
} from '../../../template/+state/template-overtime/template-overtime.action';
import { DatePipe } from '@angular/common';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { Overtime } from '../../../../../../../../libs/data-models/hr/salary/overtime';
import { OvertimeService } from '../../service/overtime.service';

@Component({
  selector: 'app-payroll-overtime',
  templateUrl: 'overtime.component.html'
})
export class OvertimeComponent implements OnInit {
  @Input() createdAt?: Date;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  formGroup = new FormGroup({
    title: new FormControl(''),
    name: new FormControl(''),
    startAt: new FormControl(),
    endAt: new FormControl()
  });
  salaryType = SalaryTypeEnum;
  pageSize: number = 30;
  pageIndexInit = 0;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  overtime!: Overtime;
  // overtime$ = this.store.pipe(select(selectorOvertime));
  // loaded$ = this.store.pipe(select(selectedLoadedSalary));
  loaded = false;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  adding$ = this.store.pipe(select(selectedAddingPayroll));

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    console.log(this.createdAt)
    this.overtimeService.getOvertime(
      {
        startAt: this.createdAt ? getFirstDayInMonth(new Date(this.createdAt)) : getFirstDayInMonth(new Date()),
        endAt: this.createdAt ? getLastDayInMonth(new Date(this.createdAt)) : getLastDayInMonth(new Date())
      }
    ).subscribe(val => {
      this.loaded = true;
      return this.overtime = val;
    });
    if (this.createdAt) {
      this.formGroup.get('startAt')!.setValue(this.datePipe.transform(getFirstDayInMonth(new Date(this.createdAt)), 'yyyy-MM-dd'));
      this.formGroup.get('endAt')!.setValue(this.datePipe.transform(getLastDayInMonth(new Date(this.createdAt)), 'yyyy-MM-dd'));
    }
    // this.store.dispatch(PayrollAction.filterOvertime({
    //   skip: this.pageIndexInit,
    //   take: this.pageSize,
    //   startAt: this.createdAt ? getFirstDayInMonth(new Date(this.createdAt)) : getFirstDayInMonth(new Date()),
    //   endAt: this.createdAt ? getLastDayInMonth(new Date(this.createdAt)) : getLastDayInMonth(new Date())
    // }));
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate({}));
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        if ((value.startAt && value.endAt)) {
          this.loaded = false;
          this.overtimeService.getOvertime(
            {
              startAt: new Date(value.startAt),
              endAt: new Date(value.endAt),
              title: value.title,
              name: value.name
            }
          ).subscribe(val => {
            this.loaded = true;
            return this.overtime = val;
          });
          // this.store.dispatch(PayrollAction.filterOvertime({
          //   take: this.pageSize,
          //   skip: this.pageIndexInit,
          //   startAt: new Date(value.startAt),
          //   endAt: new Date(value.endAt),
          //   title: value.title
          // }));
          this.EventSelectMonth.emit(new Date(value.startAt));
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
}
