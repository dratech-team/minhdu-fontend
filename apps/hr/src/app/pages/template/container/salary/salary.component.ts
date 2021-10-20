import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { TemplateSalary } from '../../+state/teamlate-salary/template-salary';
import { TemplateSalaryAction } from '../../+state/teamlate-salary/template-salary.action';
import { TemplateSalaryBasicComponent } from '../../component/template-salary/template-salary-basic.component';
import { selectorAllTemplate, selectTemplateAdding } from '../../+state/teamlate-salary/template-salary.selector';


@Component({
  templateUrl: 'salary.component.html'
})
export class SalaryComponent implements OnInit {
  adding$ = this.store.pipe(select(selectTemplateAdding));
  templateSalaries$ = this.store.pipe(select(selectorAllTemplate));
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  pageSize = 30;
  pageIndexInit = 0;
  salaryBasic!: TemplateSalary [];
  formGroup = new FormGroup(
    {
      title: new FormControl(''),
      price: new FormControl('')
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.store.dispatch(TemplateSalaryAction.loadInit({ take: this.pageSize, skip: this.pageIndexInit }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            TemplateOvertimeAction.loadInit(
              this.template(val))
          );
        })
      )
      .subscribe();
  }


  templateBasicSalary(template?: any) {
    this.dialog.open(TemplateSalaryBasicComponent, {
      width: 'fit-content',
      data: template
    });
  }


  template(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      title: val.title,
      price: val.price
    };
  }

  deleteBasicSalary($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(TemplateSalaryAction.deleteTemplate({ id: $event.id }));
      }
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      TemplateSalaryAction.loadMoreTemplateBasic(this.template(val))
    );
  }
}
