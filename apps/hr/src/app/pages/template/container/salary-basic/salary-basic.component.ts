import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { TemplateBasicSalary } from '../../+state/teamlate-salary-basic/template-basic-salary';
import { TemplateSalaryBasicComponent } from '../../component/template-salary-basic/template-salary-basic.component';
import { debounceTime, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { selectorAllTemplate } from '../../+state/teamlate-salary-basic/template-basic-salary.selector';
import { TemplateBasicAction } from '../../+state/teamlate-salary-basic/template-basic-salary.action';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';


@Component({
  templateUrl: 'salary-basic.component.html'
})
export class SalaryBasicComponent implements OnInit {
  templateSalaryBasic$ = this.store.pipe(select(selectorAllTemplate))
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  pageSize = 30;
  pageIndexInit = 0;
  salaryBasic!: TemplateBasicSalary [];
  formGroup = new FormGroup(
    {
      title: new FormControl(''),
      price: new FormControl('')
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(TemplateBasicAction.loadInit({take:this.pageSize, skip: this.pageIndexInit}))
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
      width: '40%',
      data: template
    })
  }


  template(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      title: val.title,
      price: val.price,
    };
  }

  deleteBasicSalary($event: any) {
     const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'})
    ref.afterClosed().subscribe(val =>{
      if (val){
        this.store.dispatch(TemplateBasicAction.deleteTemplate({id: $event.id}))
      }
    })
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      TemplateBasicAction.loadMoreTemplateBasic(this.template(val))
    );
  }
}
