import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate } from '../../+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { TemplateOvertimeComponent } from '../../component/template-overtime/template-overtime.component';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';

@Component({
  templateUrl: 'template.component.html',
})
export class TemplateComponent implements OnInit {
  type = SalaryTypeEnum;
  templates$ = this.store.pipe(select(selectorAllTemplate));

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(TemplateOvertimeAction.loadAllTempLate());
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
    console.log($event.id)
    const dialogRef = this.dialog.open(DialogDeleteComponent,{width:'30%'});
    dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.store.dispatch(TemplateOvertimeAction.deleteTemplate($event.id));
        }
      }
    );
  }
}
