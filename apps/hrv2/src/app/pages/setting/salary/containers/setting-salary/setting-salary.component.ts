import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { PaginationDto } from '@minhdu-fontend/constants';
import {
  SettingSalaryActions,
  SettingSalaryQuery,
  SettingSalaryStore,
} from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SalaryTypeEnum } from '../../enums';
import { blockSalariesConstant } from '../../constants';
import { SalarySettingEntity } from '../../entities';
import { ModalSettingSalaryComponent } from '../../components/setting-salary';
import { AddOrUpdateSettingSalary } from '../../data/modal-setting-salary.data';
import { ModalAlertComponent } from '@minhdu-fontend/components';
import { ModalAlertEntity } from '@minhdu-fontend/base-entity';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  BranchActions,
  BranchEntity,
  BranchQuery,
  PositionActions,
  PositionEntity,
  PositionQuery,
} from '@minhdu-fontend/orgchart-v2';
import * as _ from 'lodash';
import { UnitDatetimeConstant } from '../../constants/unit-datetime.constant';
import { Sort } from '@minhdu-fontend/data-models';
import { SortSettingSalaryEnum } from '../../enums/sort-setting-salary.enum';
import { ModeEnum } from '@minhdu-fontend/enums';
import { ActivatedRoute } from '@angular/router';
import { AccountQuery } from '../../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  selector: 'minhdu-fontend-setting-salary',
  templateUrl: 'setting-salary.component.html',
})
export class SettingSalaryComponent implements OnInit {
  settingSalaries$ = this.settingSalaryQuery.selectAll();
  loading$ = this.settingSalaryQuery.select((state) => state.loading);
  total$ = this.settingSalaryQuery.select((state) => state.total);
  remain$ = this.settingSalaryQuery.select((state) => state.remain);
  count$ = this.settingSalaryQuery.selectCount();
  positions$ = this.positionQuery.selectAll();
  branches$ = this.branchQuery.selectAll();
  currentUser$ = this.accountQuery.selectCurrentUser();

  stateSearch = this.settingSalaryQuery.getValue().search;
  blockSalaries = blockSalariesConstant.concat([
    {
      title: 'L????ng tr??ch b???o hi???m',
      type: SalaryTypeEnum.BASIC_INSURANCE,
    },
  ]);
  datetimeConstant = UnitDatetimeConstant;
  panelOpenState = false;
  visible = false;
  salaryTypeEnum = SalaryTypeEnum;
  valueSort = {
    orderBy: this.stateSearch?.orderBy,
    orderType: this.stateSearch?.orderType,
  };
  sortEnum = SortSettingSalaryEnum;
  modeEnum = ModeEnum;

  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.stateSearch?.search || ''),
    types: new UntypedFormControl(this.stateSearch?.types || []),
    positions: new UntypedFormControl(this.stateSearch?.positions || []),
    branches: new UntypedFormControl(this.stateSearch?.branches || []),
  });
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly settingSalaryStore: SettingSalaryStore,
    private readonly message: NzMessageService,
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit() {
    this.actions$.dispatch(PositionActions.loadAll({}));
    this.actions$.dispatch(BranchActions.loadAll({}));

    this.onLoad(false);
    this.formGroup.valueChanges.pipe(debounceTime(1000)).subscribe((_) => {
      this.onLoad(false);
    });
  }

  onLoadMore() {
    this.onLoad(true);
  }

  onLoad(isPaginate: boolean) {
    this.actions$.dispatch(
      SettingSalaryActions.loadAll({
        search: this.mapSettingSalary(this.formGroup.value, isPaginate),
        isSet: isPaginate,
      })
    );
  }

  mapSettingSalary(dataFG: any, isPagination: boolean) {
    this.settingSalaryStore.update((state) => ({
      ...state,
      search: Object.assign({}, dataFG, this.valueSort),
    }));
    return Object.assign({}, _.omit(dataFG, ['positions', 'branches']), {
      orderBy: this.valueSort?.orderBy || '',
      orderType: this.valueSort?.orderType || '',
      positionIds: dataFG.positions
        ? dataFG.positions?.map((position: PositionEntity) => position.id)
        : '',
      branchIds: dataFG.branches
        ? dataFG.branches?.map((branch: BranchEntity) => branch.id)
        : '',
      take: PaginationDto.take,
      skip: isPagination
        ? this.settingSalaryQuery.getCount()
        : PaginationDto.skip,
    });
  }

  onAdd() {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'T???o m???t thi???t l???p l????ng',
      nzContent: ModalSettingSalaryComponent,
      nzFooter: [],
    });
  }

  onUpdate(template: SalarySettingEntity) {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'C???p nh???t thi???t l???p l????ng',
      nzContent: ModalSettingSalaryComponent,
      nzComponentParams: <{ data?: AddOrUpdateSettingSalary }>{
        data: {
          update: { template: template },
        },
      },
      nzFooter: [],
    });
  }

  onDelete(template: SalarySettingEntity) {
    this.modal
      .create({
        nzTitle: `Xo?? B???n m???u ${template.title}`,
        nzContent: ModalAlertComponent,
        nzComponentParams: <{ data: ModalAlertEntity }>{
          data: {
            description: `b???n c?? ch???c ch???n mu???n xo?? b???n m???u ${template.title} n??y kh??ng ?`,
          },
        },
        nzFooter: [],
      })
      .afterClose.subscribe((val) => {
        if (val) {
          this.actions$.dispatch(
            SettingSalaryActions.remove({ id: template.id })
          );
        }
      });
  }

  onDevelopment() {
    this.message.info('T??nh n??ng ??ang ph??t tri???n');
  }

  onSort(sort: Sort) {
    this.valueSort = sort;
    this.onLoad(false);
  }
}
