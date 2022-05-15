import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {SettingSalaryActions, SettingSalaryQuery, SettingSalaryStore} from '../../state';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {SalaryTypeEnum} from "../../enums";
import {blockSalariesConstant} from "../../constants";
import {SalarySettingEntity} from "../../entities";
import {SettingSalaryDialogComponent} from "../../components/salary-setting";
import {AddOrUpdateSettingSalary} from "../../data/modal-setting-salary.data";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";

@Component({
  selector: 'minhdu-fontend-salary-setting',
  templateUrl: 'salary-setting.component.html'
})
export class SalarySettingComponent implements OnInit {
  settingSalaries$ = this.settingSalaryQuery.selectAll();
  loading$ = this.settingSalaryQuery.select(state => state.loading);
  loadMore$ = this.settingSalaryQuery.select(state => state.loadMore);
  total$ = this.settingSalaryQuery.select(state => state.total)
  count$ = this.settingSalaryQuery.selectCount()

  stateSearch = this.settingSalaryQuery.getValue().search;
  blockSalaries = blockSalariesConstant.concat([{
    title: 'Lương trích bảo hiểm',
    type: SalaryTypeEnum.BASIC_INSURANCE
  }]);

  panelOpenState = false;
  visible = false;
  salaryTypeEnum = SalaryTypeEnum;


  formGroup = new FormGroup(
    {
      search: new FormControl(''),
      types: new FormControl(this.stateSearch.types || []),
    }
  );
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
    this.onLoad(false)
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
    ).subscribe(_ => {
      this.onLoad(false)
    });
  }

  onLoadMore() {
    this.onLoad(true)
  }

  onLoad(isPaginate: boolean) {
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: this.mapSettingSalary(this.formGroup.value, true),
      isPaginate: isPaginate
    }));
  }

  mapSettingSalary(dataFG: any, isPagination: boolean) {
    this.settingSalaryStore.update(state => ({
      ...state, search: dataFG
    }));
    return Object.assign({}, dataFG, {
        take: PaginationDto.take,
        skip: isPagination ? this.settingSalaryQuery.getCount() : PaginationDto.skip
      }
    );
  }

  onAdd() {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'Tạo bản mẫu lương',
      nzContent: SettingSalaryDialogComponent,
      nzFooter: [],
    })
  }

  onUpdate(template: SalarySettingEntity) {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'Tạo bản mẫu lương',
      nzContent: SettingSalaryDialogComponent,
      nzComponentParams: <{ data?: AddOrUpdateSettingSalary }>{
        data: {
          update: {template: template}
        }
      },
      nzFooter: [],
    })
  }

  onDelete(template: SalarySettingEntity) {
    this.modal.create({
      nzTitle: `Xoá Bản mẫu ${template.title}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `bạn có chắc chắn muốn xoá bản mẫu ${template.title} này không ?`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(SettingSalaryActions.remove({id: template.id}))
      }
    })
  }
}
