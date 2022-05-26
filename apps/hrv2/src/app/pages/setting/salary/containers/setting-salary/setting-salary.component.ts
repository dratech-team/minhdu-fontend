import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {SettingSalaryActions, SettingSalaryQuery, SettingSalaryStore} from '../../state';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {SalaryTypeEnum} from "../../enums";
import {blockSalariesConstant} from "../../constants";
import {SalarySettingEntity} from "../../entities";
import {ModalSettingSalaryComponent} from "../../components/setting-salary";
import {AddOrUpdateSettingSalary} from "../../data/modal-setting-salary.data";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";
import {NzMessageService} from "ng-zorro-antd/message";
import {
  BranchActions,
  BranchEntity,
  BranchQuery,
  PositionActions,
  PositionEntity,
  PositionQuery
} from "@minhdu-fontend/orgchart-v2";
import * as _ from 'lodash'

@Component({
  selector: 'minhdu-fontend-setting-salary',
  templateUrl: 'setting-salary.component.html'
})
export class SettingSalaryComponent implements OnInit {
  settingSalaries$ = this.settingSalaryQuery.selectAll();
  loading$ = this.settingSalaryQuery.select(state => state.loading);
  loadMore$ = this.settingSalaryQuery.select(state => state.loadMore);
  total$ = this.settingSalaryQuery.select(state => state.total)
  remain$ = this.settingSalaryQuery.select(state => state.remain)
  count$ = this.settingSalaryQuery.selectCount()
  positions$ = this.positionQuery.selectAll()
  branches$ = this.branchQuery.selectAll()

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
      search: new FormControl(this.stateSearch?.search || ''),
      types: new FormControl(this.stateSearch?.types || []),
      positions: new FormControl(this.stateSearch?.positions || []),
      branches: new FormControl(this.stateSearch?.branches || []),
    }
  );
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly settingSalaryStore: SettingSalaryStore,
    private readonly message: NzMessageService,
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(PositionActions.loadAll({}))
    this.actions$.dispatch(BranchActions.loadAll({}))

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
      search: this.mapSettingSalary(this.formGroup.value, isPaginate),
      isPaginate: isPaginate
    }));
  }

  mapSettingSalary(dataFG: any, isPagination: boolean) {
    this.settingSalaryStore.update(state => ({
      ...state, search: dataFG
    }));
    return Object.assign({}, _.omit(dataFG, ['positions', 'branches']), {
        positionIds: dataFG.positions ? dataFG.positions?.map((position: PositionEntity) => position.id) : '',
        branchIds: dataFG.branches ? dataFG.branches?.map((branch: BranchEntity) => branch.id) : '',
        take: PaginationDto.take,
        skip: isPagination ? this.settingSalaryQuery.getCount() : PaginationDto.skip
      }
    );
  }

  onAdd() {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'Tạo một thiết lập lương',
      nzContent: ModalSettingSalaryComponent,
      nzFooter: [],
    })
  }

  onUpdate(template: SalarySettingEntity) {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'Cập nhật thiết lập lương',
      nzContent: ModalSettingSalaryComponent,
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

  onDevelopment() {
    this.message.info('Tính năng đang phát triển')
  }
}
