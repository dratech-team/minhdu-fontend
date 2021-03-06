import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { TemplateSalaryAction } from '../../+state/teamlate-salary/template-salary.action';
import { TemplateSalaryComponent } from '../../component/template-salary/template-salary.component';
import {
  selectorAllTemplate,
  selectTemplateAdding,
  selectTemplateLoaded,
  selectTotalTemplateSalary,
} from '../../+state/teamlate-salary/template-salary.selector';
import { SalarySetting } from '../../+state/teamlate-salary/salary-setting';
import { blockSalariesConstant } from '../../constants';
import { tranFormSalaryType } from '../../../payroll/utils';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'salary.component.html',
})
export class SalaryComponent implements OnInit {
  adding$ = this.store.pipe(select(selectTemplateAdding));
  total$ = this.store.pipe(select(selectTotalTemplateSalary));
  loaded$ = this.store.pipe(select(selectTemplateLoaded));
  templateSalaries$ = this.store.pipe(select(selectorAllTemplate));
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  salaryTypeEnum = SalaryTypeEnum;
  blockSalaries = blockSalariesConstant.concat([
    { title: 'Tất cả', type: SalaryTypeEnum.ALL },
    {
      title: 'Lương cơ bản trích bảo hiểm',
      type: SalaryTypeEnum.BASIC_INSURANCE,
    },
  ]);
  pageSize = 30;
  pageIndexInit = 0;
  formGroup = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    unit: new UntypedFormControl(''),
    salaryType: new UntypedFormControl(''),
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly activeRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activeRouter.queryParams.subscribe((val) => {
      if (val.title) {
        this.formGroup.get('title')?.setValue(val.title);
      }
    });
    this.store.dispatch(
      TemplateSalaryAction.loadInit({
        templateSalaryDTO: {
          take: this.pageSize,
          skip: this.pageIndexInit,
          title: this.formGroup.value.title,
        },
      })
    );
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            TemplateSalaryAction.loadInit({
              templateSalaryDTO: this.template(val),
            })
          );
        })
      )
      .subscribe();
  }

  addTemplateSalary(template?: SalarySetting) {
    this.dialog.open(TemplateSalaryComponent, {
      width: 'fit-content',
      data: { template },
    });
  }

  updateTemplateSalary(template: any) {
    this.dialog.open(TemplateSalaryComponent, {
      width: 'fit-content',
      data: { isUpdate: true, template: template },
    });
  }

  template(val: any) {
    const settingSalary = {
      take: this.pageSize,
      skip: this.pageIndexInit,
      title: val.title,
      unit: val.unit,
    };
    if (val.salaryType) {
      Object.assign(settingSalary, {
        salaryType: val.salaryType,
      });
    }
    return settingSalary;
  }

  deleteBasicSalary($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          TemplateSalaryAction.deleteTemplate({ id: $event.id })
        );
      }
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      TemplateSalaryAction.loadMoreTemplateBasic({
        templateSalaryDTO: this.template(val),
      })
    );
  }

  tranFormType(salaryTypes?: SalaryTypeEnum[]) {
    if (salaryTypes && salaryTypes.length > 0) {
      return tranFormSalaryType(salaryTypes);
    } else {
      return '';
    }
  }
}
