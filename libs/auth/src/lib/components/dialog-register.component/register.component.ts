import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {App} from '@minhdu-fontend/enums';
import {RoleService} from '../../services/role.service';
import {BranchActions, BranchEntity, BranchQuery} from "@minhdu-fontend/orgchart-v2";
import {Actions} from "@datorama/akita-ng-effects";
import {AccountEntity} from "../../../../../system/src/lib/entities/account.entity";
import {NzModalRef} from "ng-zorro-antd/modal";
import {AccountActions} from "../../../../../system/src/lib/state/account-management/account.actions";
import {NzMessageService} from "ng-zorro-antd/message";
import {Store} from "@ngrx/store";
import {BaseUpdateAccount} from "../../../../../system/src/lib/dto/account/update-account.dto";
import {AddAccountDto, BaseAddAccountDto} from "../../../../../system/src/lib/dto/account/add-account.dto";
import {AccountQuery} from "../../../../../system/src/lib/state/account-management/account.query";

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @Input() data?: {
    update: {
      account: AccountEntity
    }
  }
  branches$ = this.branchQuery.selectAll()
  role$ = this.roleService.getAll();
  added$ = this.accountQuery.select(state => state.added)

  localhost = `${window.location.host}`;
  app = App;
  formGroup!: FormGroup;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly branchQuery: BranchQuery,
    private readonly accountQuery: AccountQuery,
    private readonly roleService: RoleService,
    private readonly actions$: Actions,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService
  ) {
  }


  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))
    if (this.data?.update) {
      this.formGroup = this.formBuilder.group(
        {
          role: [this.data.update.account.role, Validators.required],
          branches: [this.data.update.account.branches],
        }
      );
    } else {
      this.formGroup = this.formBuilder.group(
        {
          userName: ['', Validators.required],
          password: ['', Validators.required],
          password2: ['', Validators.required],
          role: ['', Validators.required],
          branches: [[]],
        }
      );
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const val = this.formGroup.value;
    if (!this.data?.update && val.password !== val.password2) {
      return this.message.warning('Nhập lại mật khẩu chưa đúng')
    }
    const account = this.mapAccount(val)
    this.data?.update
      ? this.actions$.dispatch(AccountActions.update({
        id: this.data.update.account.id,
        updates: account
      }))
      : this.actions$.dispatch(AccountActions.addOne({
          body: account
        })
      )
    this.added$.subscribe(val => {
      if(val){
        this.modalRef.close();
      }
    })
  }

  mapAccount(val: any): BaseAddAccountDto {
    return {
      username: val.userName,
      password: val.password,
      branchIds: val.branches.map((item: BranchEntity) => item.id),
      roleId: val.role.id,
      appName: val.role.appName,
    };
  }
}
