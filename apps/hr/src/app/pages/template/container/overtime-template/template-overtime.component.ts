import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Position} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, EmployeeType, FilterTypeEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {select, Store} from '@ngrx/store';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import * as lodash from 'lodash';
import {debounceTime, startWith, tap} from 'rxjs/operators';
import {TemplateOvertimeAction} from '../../+state/template-overtime/template-overtime.action';
import {
  selectorAllTemplate,
  selectTemplateAdding,
  selectTemplateLoaded,
  selectTotalTemplateOvertime
} from '../../+state/template-overtime/template-overtime.selector';
import {searchAutocomplete} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {PayrollAction} from '../../../payroll/+state/payroll/payroll.action';
import {DialogTemplateOvertimeComponent} from '../../component/template-overtime/dialog-template-overtime.component';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {of} from 'rxjs';
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
  fCtrlPosition = new FormControl('');
  formGroup = new FormGroup({
    title: new FormControl(''),
    price: new FormControl(''),
    unit: new FormControl(''),
    note: new FormControl(''),
    branch: new FormControl(''),
    employeeType: new FormControl('')
  });
  positionsSelected: Position[] = [];
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));

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

    this.positions$ = searchAutocomplete(
      this.fCtrlPosition.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
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
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      title: val.title,
      price: val.price,
      unit: val.unit,
      note: val.note,
      branch: val.branch,
      positionIds: this.positionsSelected.map((val) => val.id)
    };
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('position')?.patchValue(branchName);
  }

  onSelectPosition(
    position: Position,
    event: any,
    positionInput: HTMLElement
  ): any {
    if (event.isUserInput) {
      if (this.positionsSelected.length < 3) {
        if (position.id) {
          if (this.positionsSelected.some((item) => item.id === position.id)) {
            this.message.success('chức vụ đã được chọn');
          } else {
            this.positionsSelected.push(position);
            const value = this.formGroup.value;
            this.store.dispatch(
              TemplateOvertimeAction.loadInit({
                templateOvertimeDTO: this.template(value)
              })
            );
          }
        }
      } else {
        this.message.error('Chọn tối đa 3 chức vụ');
      }
      setTimeout(() => {
        this.fCtrlPosition.setValue('');
        positionInput.blur();
      });
    }
  }

  removePosition(position: Position) {
    lodash.remove(this.positionsSelected, position);
    const value = this.formGroup.value;
    this.store.dispatch(
      TemplateOvertimeAction.loadInit({
        templateOvertimeDTO: this.template(value)
      })
    );
  }

  onOvertime(template: any, position?: Position) {
    if (position) {
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          position: position.name,
          filter: FilterTypeEnum.OVERTIME
        })
      );
    }
    if(template?.branch){
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          branch: template.branch
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
