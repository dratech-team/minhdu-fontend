import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {SettingSalaryQuery} from '../../state';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {SettingSalaryStore} from '../../state';
import {SalaryTypeEnum} from "../../enums";
import {blockSalariesConstant, recipesConstant} from "../../constants";
import {SalarySettingEntity} from "../../entities";
import {SettingSalaryActions} from "../../state";
import {SettingSalaryDialogComponent} from "../../components/salary-setting";
import {transFormTotalOf} from "../../utils/transform-total-of.util";

@Component({
  selector: 'minhdu-fontend-salary-setting',
  templateUrl: 'salary-setting.component.html'
})
export class SalarySettingComponent implements OnInit {
  settingSalaries$ = this.settingSalaryQuery.selectAll();
  loading$ = this.settingSalaryQuery.selectLoading();
  stateSearch = this.settingSalaryQuery.getValue().search;
  formGroup = new FormGroup(
    {
      search: new FormControl(''),
    }
  );
  panelOpenState = false;
  pageSizeTable = 10;
  visible = false;
  pageSize = 10;
  salaryTypeEnum = SalaryTypeEnum;
  blockSalaries = blockSalariesConstant;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly settingSalaryStore: SettingSalaryStore
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: this.mapProduct(this.formGroup.value, false)
    }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(SettingSalaryActions.loadAll({
            search: this.mapProduct(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.settingSalaryQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(SettingSalaryActions.loadAll({
        search: this.mapProduct(this.formGroup.value, true),
        isPaginate: true
      }));
    }
  }

  mapProduct(dataFG: any, isPagination: boolean) {
    this.settingSalaryStore.update(state => ({
      ...state, search: dataFG
    }));
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.settingSalaryQuery.getCount() : PaginationDto.skip
    });
    return dataFG;
  }

  transFormTotalOf(totalOf: SalaryTypeEnum[]) {
    return  transFormTotalOf(totalOf)
  }

  onAdd(template?: SalarySettingEntity) {
    this.modal.create({
      nzWidth:'30vw',
      nzTitle: 'Tạo bản mẫu lương',
      nzContent: SettingSalaryDialogComponent,
      nzComponentParams: {
        data: {template: template}
      },
      nzFooter: null,
    })
  }

  onUpdate(template: SalarySettingEntity) {
    this.modal.create({
      nzWidth:'fit-content',
      nzTitle: 'Tạo bản mẫu lương',
      nzContent: SettingSalaryDialogComponent,
      nzComponentParams:{
        data: {isUpdate: true , template : template}
      },
      nzFooter: null,
    })
  }

  onDelete(template: SalarySettingEntity) {
  }
}
