import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Branch, Position} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, EmployeeType, FilterTypeEnum, ItemContextMenu, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {select, Store} from '@ngrx/store';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {debounceTime, tap} from 'rxjs/operators';
import {TemplateOvertimeAction} from '../../+state/template-overtime/template-overtime.action';
import {
  selectorAllTemplate,
  selectTemplateAdding,
  selectTemplateLoaded,
  selectTotalTemplateOvertime
} from '../../+state/template-overtime/template-overtime.selector';
import {AppState} from '../../../../reducers';
import {PayrollAction} from '../../../payroll/+state/payroll/payroll.action';
import {DialogTemplateOvertimeComponent} from '../../component/template-overtime/dialog-template-overtime.component';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  templateUrl: 'template-overtime.component.html'
})
export class TemplateOvertimeComponent implements OnInit {
  adding$ = this.store.pipe(select(selectTemplateAdding));
  total$ = this.store.pipe(select(selectTotalTemplateOvertime));
  loaded$ = this.store.select(selectTemplateLoaded);
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  pageSize = 30;
  pageIndexInit = 0;
  EmployeeType = EmployeeType;
  formGroup = new FormGroup({
    title: new FormControl(''),
    price: new FormControl(''),
    unit: new FormControl(''),
    note: new FormControl(''),
    branch: new FormControl([]),
    position: new FormControl([]),
    employeeType: new FormControl('')
  });
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  itemContextMenu = ItemContextMenu
  ;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly message: NzMessageService,
    private readonly store: Store<AppState>
  ) {
  }

  templates$ = this.store.pipe(select(selectorAllTemplate));

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(
      TemplateOvertimeAction.loadInit({
        templateOvertimeDTO: {
          take: this.pageSize,
          skip: this.pageIndexInit
        }
      })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            TemplateOvertimeAction.loadInit({
              templateOvertimeDTO: this.template(val)
            })
          );
        })
      )
      .subscribe();
  }

  templateOvertime($event?: any) {
    this.dialog.open(DialogTemplateOvertimeComponent, {
      width: '40%',
      data: $event
    });
  }

  deleteOvertime($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          TemplateOvertimeAction.deleteTemplate({id: $event.id})
        );
      }
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      TemplateOvertimeAction.loadMoreTemplateOverTime({
        templateOvertimeDTO: this.template(val)
      })
    );
  }

  template(val: any) {
    const result = {
      take: this.pageSize,
      skip: this.pageIndexInit,
      title: val.title,
      price: val.price,
      unit: val.unit,
      note: val.note,
      branchIds: val.branch ? val.branch.map((val: Branch) => val.id) : [],
      positionIds: val.position ? val.position.map((val: Position) => val.id) : []
    };
    if (!val.unit) {
      delete result.unit
    }
    return result
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('position')?.patchValue(branchName);
  }

  onOvertime(template: any, position?: Position) {
    if (position) {
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          position: position,
          filter: FilterTypeEnum.OVERTIME
        })
      );
    }
    if (template?.branch) {
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          branch: template.branch,
          filter: FilterTypeEnum.OVERTIME
        })
      );
    }
    this.store.dispatch(
      PayrollAction.updateStatePayroll({
        filter: FilterTypeEnum.OVERTIME
      })
    );

    this.router
      .navigate(['phieu-luong'], {
        queryParams: {
          titleOvertime: template.title
        }
      })
      .then();
  }
}
