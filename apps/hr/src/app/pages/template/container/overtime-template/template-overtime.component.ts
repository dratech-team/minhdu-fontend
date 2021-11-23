import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate, selectTemplateAdding } from '../../+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { DatetimeUnitEnum, EmployeeType, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { DialogTemplateOvertimeComponent } from '../../component/template-overtime/dialog-template-overtime.component';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAutocomplete } from '../../../../../../../../libs/utils/autocomplete.ultil';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';


@Component({
  templateUrl: 'template-overtime.component.html'
})
export class TemplateOvertimeComponent implements OnInit {
  adding$ = this.store.pipe(select(selectTemplateAdding));
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  pageSize = 30;
  pageIndexInit = 0;
  employeeTypeEnum = EmployeeType;
  formGroup = new FormGroup(
    {
      title: new FormControl(''),
      price: new FormControl(''),
      unit: new FormControl(''),
      note: new FormControl(''),
      position: new FormControl(''),
      branch: new FormControl(''),
      employeeType: new FormControl('')
    }
  );
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {
  }

  templates$ = this.store.pipe(select(selectorAllTemplate));

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(TemplateOvertimeAction.loadInit({
      templateOvertimeDTO: {
        take: this.pageSize,
        skip: this.pageIndexInit
      }
    }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            TemplateOvertimeAction.loadInit(
              {
                templateOvertimeDTO: this.template(val)
              })
          );
        })
      )
      .subscribe();


    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );
  }

  templateOvertime($event?: any) {
    this.dialog.open(DialogTemplateOvertimeComponent, {
      width: '40%',
      data: $event
    });
  }

  deleteOvertime($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.store.dispatch(TemplateOvertimeAction.deleteTemplate({ id: $event.id }));
        }
      }
    );
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      TemplateOvertimeAction.loadMoreTemplateOverTime(
        {
          templateOvertimeDTO: this.template(val)
        }
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
      branch: val.branch
    };
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }
}
