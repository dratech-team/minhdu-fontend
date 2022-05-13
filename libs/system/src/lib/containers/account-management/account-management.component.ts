import {Component, OnInit} from '@angular/core';
import {App} from '@minhdu-fontend/enums';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {AccountActions} from '../../state/account-management/account.actions';
import {MatDialog} from '@angular/material/dialog';
import {RegisterComponent} from '../../../../../auth/src/lib/components/dialog-register.component/register.component';
import {roleAppHR} from '@minhdu-fontend/constants';
import {ModalAlertComponent} from '@minhdu-fontend/components';
import {Actions} from "@datorama/akita-ng-effects";
import {AccountQuery} from "../../state/account-management/account.query";
import {AccountStore} from "../../state/account-management/account.store";
import {BranchActions, BranchEntity, BranchQuery} from "@minhdu-fontend/orgchart-v2";
import {SearchAccountDto} from "../../dto/account/search-account.dto";
import {AccountEntity} from "../../entities/account.entity";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";

@Component({
  templateUrl: 'account-management.component.html'
})
export class AccountManagementComponent implements OnInit {
  accounts$ = this.accountQuery.selectAll()
  loading$ = this.accountQuery.select(state => state.loading)
  loadMore$ = this.accountQuery.select(state => state.loadMore)
  total$ = this.accountQuery.select(state => state.total)
  count$ = this.accountQuery.selectCount()
  branches$ = this.branchQuery.selectAll()

  app = App;
  roleHr = roleAppHR;

  formGroup = new FormGroup({
    search: new  FormControl(''),
    id: new FormControl(''),
    username: new FormControl(''),
    branches: new FormControl([]),
    role: new FormControl(''),
    loggedAt: new FormControl(''),
    ip: new FormControl(''),
    createdAt: new FormControl('')
  });
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly accountQuery: AccountQuery,
    private readonly accountStore: AccountStore,
    private readonly branchQuery: BranchQuery,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.onLoad(false)
    this.actions$.dispatch(BranchActions.loadAll({}))
    this.formGroup.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(_ => this.onLoad(false));
  }

  onLoad(isPaginate: boolean) {
    this.actions$.dispatch(AccountActions.loadAll(this.mapAccount(isPaginate)))
  }

  onLoadMore() {
    this.onLoad(true)
  }

  mapAccount(isPaginate: boolean): SearchAccountDto {
    const value = this.formGroup.value
    this.accountStore.update(state => ({
      ...state, search: value
    }))
    return {
      search: Object.assign({}, value, {branch: value.branches.map((branch: BranchEntity) => branch.id) || ''}),
      isPaginate: isPaginate
    }
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'Tạo tài khoản',
      nzContent: RegisterComponent,
      nzFooter:[]
    })
  }

  onUpdate(account: AccountEntity) {
    this.dialog.open(RegisterComponent, {width: 'fit-content', data: {account: account, isUpdate: true}});
  }

  onDelete(account: AccountEntity) {
    this.modal.create({
      nzTitle: 'Xoá tài khoản',
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có chắc chắn muốn xoá tài khoản ${account.username} này không`,
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(AccountActions.remove({id: account.id}))
      }
    })
  }
}
