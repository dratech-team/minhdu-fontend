import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate, selectTemplateLoaded } from '../../+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { TemplateOvertimeComponent } from '../../component/template-overtime/template-overtime.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';


@Component({
  templateUrl: 'template.component.html'
})
export class TemplateComponent implements OnInit {
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  pageSize = 30;
  pageIndexInit = 0;
  formGroup = new FormGroup(
    {
      title: new FormControl(''),
      price: new FormControl(''),
      unit: new FormControl(''),
      note: new FormControl(''),
      position: new FormControl(''),
      department: new FormControl(''),
      branch: new FormControl(''),
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {
  }

  templates$ = this.store.pipe(select(selectorAllTemplate));
  loaded$ = this.store.pipe(select(selectTemplateLoaded));

  ngOnInit() {
    this.store.dispatch(TemplateOvertimeAction.loadInit({take:this.pageSize, skip: this.pageIndexInit}));
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

  templateOvertime($event?: any) {
    const dialogRef = this.dialog.open(TemplateOvertimeComponent, {
      width: '40%',
      data: $event
    });
    dialogRef.afterClosed().subscribe((val) => {
        if (val) {
          if (val.isUpdate) {
            this.store.dispatch(TemplateOvertimeAction.updateTemplate({ id: val.id, templateOvertime: val.data }));
          } else {
            this.store.dispatch(TemplateOvertimeAction.AddTemplate({ templateOvertime: val.data }));
          }
        }
      }
    );
  }

  deleteOvertime($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.store.dispatch(TemplateOvertimeAction.deleteTemplate($event.id));
        }
      }
    );
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      TemplateOvertimeAction.loadMoreTemplateOverTime(
        this.template(val)
      )
    );
  }

  template(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      title: val.title,
      price: val.price,
      unit: val.unit,
      note: val.note,
      position: val.position,
      department: val.department,
      branch: val.branch
    };
  }
}
