import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { TemplateSalaryAction } from '../../+state/teamlate-salary/template-salary.action';
import { TemplateSalaryComponent } from '../../component/template-salary/template-salary.component';
import {
  selectorAllTemplate,
  selectTemplateAdding, selectTemplateLoaded,
  selectTotalTemplateSalary
} from '../../+state/teamlate-salary/template-salary.selector';
import { BlockSalariesConstant, UnitsConstant } from '@minhdu-fontend/constants';


@Component({
  templateUrl: 'salary.component.html'
})
export class SalaryComponent implements OnInit {
  adding$ = this.store.pipe(select(selectTemplateAdding));
  total$ = this.store.pipe(select(selectTotalTemplateSalary));
  loaded$ = this.store.pipe(select(selectTemplateLoaded));
  templateSalaries$ = this.store.pipe(select(selectorAllTemplate));
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  unitsConstant = UnitsConstant;
  blockSalaries = BlockSalariesConstant.concat({ title: 'Tất cả', type: SalaryTypeEnum.ALL });
  pageSize = 30;
  pageIndexInit = 0;
  formGroup = new FormGroup(
    {
      title: new FormControl(),
      unit: new FormControl(''),
      type: new FormControl('')
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.store.dispatch(TemplateSalaryAction.loadInit({
      templateSalaryDTO: {
        take: this.pageSize, skip: this.pageIndexInit
      }
    }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            TemplateSalaryAction.loadInit(
              {
                templateSalaryDTO: this.template(val)
              }
            )
          );
        })
      )
      .subscribe();
  }


  addTemplateSalary() {
    this.dialog.open(TemplateSalaryComponent, {
      width: 'fit-content'
    });
  }

  updateTemplateSalary(template: any) {
    this.dialog.open(TemplateSalaryComponent, {
      width: 'fit-content',
      data: { isUpdate: true, template: template }
    });
  }

  template(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      title: val.title,
      salaryType: val.type,
      unit: val.unit
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
      TemplateSalaryAction.loadMoreTemplateBasic(
        {
          templateSalaryDTO: this.template(val)
        }
      )
    );
  }
}
