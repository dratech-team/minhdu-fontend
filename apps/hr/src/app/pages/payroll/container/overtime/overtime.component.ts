import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatetimeUnitEnum, Gender, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedAddingPayroll,
  selectedLoadedSalary,
  selectorAllSalary
} from '../../+state/payroll/payroll.selector';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import {
  TemplateOvertimeAction
} from '../../../template/+state/template-overtime/template-overtime.action';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-overtime',
  templateUrl: 'overtime.component.html'
})
export class OvertimeComponent implements OnInit {
  @Input() createdAt?: Date;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  formGroup = new FormGroup({
    title: new FormControl(''),
    createdAt: new FormControl()
  });
  salaryType = SalaryTypeEnum;
  pageSize: number = 30;
  pageIndexInit = 0;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  salary$ = this.store.pipe(select(selectorAllSalary));
  loaded$ = this.store.pipe(select(selectedLoadedSalary));
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  adding$ = this.store.pipe(select(selectedAddingPayroll));

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.formGroup.get('createdAt')!.setValue(this.datePipe.transform(this.createdAt, 'yyyy-MM'));
    this.store.dispatch(PayrollAction.loadSalaryInit({
      skip: this.pageIndexInit,
      take: this.pageSize,
      createdAt: this.createdAt ? new Date(this.createdAt) : new Date()
    }));
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate({}));
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        this.store.dispatch(PayrollAction.loadSalaryInit({
          take: this.pageSize,
          skip: this.pageIndexInit,
          createdAt: new Date(value.createdAt),
          title: value.title
        }));
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
    this.formGroup.get('createdAt')!.valueChanges.subscribe(value => {
      this.EventSelectMonth.emit(new Date(value));
    });
  }

  onScroll() {
    this.store.dispatch(PayrollAction.loadMoreSalary({
      take: this.pageSize,
      skip: this.pageIndexInit,
      createdAt: this.formGroup.get('createdAt')!.value,
      title: this.formGroup.get('title')!.value
    }));
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
