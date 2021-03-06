import { Component, OnInit } from '@angular/core';
import { App } from '@minhdu-fontend/enums';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AccountActions } from '../../state/account-management/account.actions';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../../../../../auth/src/lib/components/dialog-register.component/register.component';
import { ModalAlertComponent } from '@minhdu-fontend/components';
import { Actions } from '@datorama/akita-ng-effects';
import { AccountQuery } from '../../state/account-management/account.query';
import { AccountStore } from '../../state/account-management/account.store';
import {
  BranchActions,
  BranchEntity,
  BranchQuery,
} from '@minhdu-fontend/orgchart-v2';
import { SearchAccountDto } from '../../dto/account/search-account.dto';
import { AccountEntity } from '../../entities/account.entity';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalAlertEntity } from '@minhdu-fontend/base-entity';
import { ModalRegisterData } from '../../data/modal-register.data';

@Component({
  templateUrl: 'account-management.component.html',
})
export class AccountManagementComponent implements OnInit {
  accounts$ = this.accountQuery.selectAll();
  loading$ = this.accountQuery.select((state) => state.loading);
  total$ = this.accountQuery.select((state) => state.total);
  remain$ = this.accountQuery.select((state) => state.remain);
  count$ = this.accountQuery.selectCount();
  branches$ = this.branchQuery.selectAll();
  currentUser$ = this.accountQuery.selectCurrentUser();

  app = App;

  stateSearch = this.accountQuery.getValue().search;
  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.stateSearch?.search || ''),
    id: new UntypedFormControl(this.stateSearch?.id || ''),
    username: new UntypedFormControl(this.stateSearch?.username || ''),
    branches: new UntypedFormControl(this.stateSearch?.branches || []),
    role: new UntypedFormControl(this.stateSearch?.role || ''),
    loggedAt: new UntypedFormControl(this.stateSearch?.loggedAt || ''),
    ip: new UntypedFormControl(this.stateSearch?.ip || ''),
    timestamp: new UntypedFormControl(this.stateSearch?.timestamp || ''),
  });
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly accountQuery: AccountQuery,
    private readonly accountStore: AccountStore,
    private readonly branchQuery: BranchQuery,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.onLoad(false);
    this.actions$.dispatch(BranchActions.loadAll({}));
    this.formGroup.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((_) => this.onLoad(false));
  }

  onLoad(isPaginate: boolean) {
    this.actions$.dispatch(AccountActions.loadAll(this.mapAccount(isPaginate)));
  }

  onLoadMore() {
    this.onLoad(true);
  }

  mapAccount(isPaginate: boolean): SearchAccountDto {
    const value = this.formGroup.value;
    this.accountStore.update((state) => ({
      ...state,
      search: value,
    }));
    return {
      search: Object.assign({}, value, {
        branch: value.branches.map((branch: BranchEntity) => branch.id) || '',
      }),
      isSet: isPaginate,
    };
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'T???o t??i kho???n',
      nzContent: RegisterComponent,
      nzFooter: [],
    });
  }

  onUpdate(account: AccountEntity) {
    this.modal.create({
      nzTitle: 'C???p nh???t t??i kho???n',
      nzContent: RegisterComponent,
      nzComponentParams: <{ data?: ModalRegisterData }>{
        data: {
          update: {
            account: account,
          },
        },
      },
      nzFooter: [],
    });
  }

  onDelete(account: AccountEntity) {
    this.modal
      .create({
        nzTitle: 'Xo?? t??i kho???n',
        nzContent: ModalAlertComponent,
        nzComponentParams: <{ data: ModalAlertEntity }>{
          data: {
            description: `B???n c?? ch???c ch???n mu???n xo?? t??i kho???n ${account.username} n??y kh??ng`,
          },
        },
        nzFooter: [],
      })
      .afterClose.subscribe((val) => {
        if (val) {
          this.actions$.dispatch(AccountActions.remove({ id: account.id }));
        }
      });
  }
}
