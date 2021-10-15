import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Role } from '../../../../../enums/hr/role.enum';
import { Localhost } from '../../../../../enums/localhost.enum';
import { App } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthActions } from '@minhdu-fontend/auth';
import { Branch } from '@minhdu-fontend/data-models';
import { BranchService } from '../../../../../orgchart/src/lib/services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { roleAppHR, roleAppSell } from '@minhdu-fontend/constants';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @ViewChild('branchInput') branchInput!: ElementRef;
  localhost = `${window.location.host}`;
  role = Role;
  app = App;
  isHidden = false;
  localhostEnum = Localhost;
  formGroup!: FormGroup;
  branchId?: number;
  branches = new FormControl();
  branches$ = this.store.pipe(select(getAllOrgchart));
  submitted = false;
  roleAppHR = roleAppHR;
  roleAppSell = roleAppSell;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private readonly branchService: BranchService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    if (this.data.isUpdate) {
      this.branchId = this.data.account?.branch?.id;
      this.formGroup = this.formBuilder.group(
        {
          role: [this.data.account.role, Validators.required]
        }
      );
    } else {
      this.formGroup = this.formBuilder.group(
        {
          userName: ['', Validators.required],
          password: ['', Validators.required],
          password2: ['', Validators.required],
          role: ['', Validators.required]
        }
      );
    }


    this.branches$ = combineLatest([
      this.branches.valueChanges.pipe(startWith('')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          const result = branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
          if (result.length === 0) {
            result.push({ id: 0, name: 'Tạo mới đơn vị' });
          }
          return result;
        } else {
          return branches;
        }
      })
    );
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (!this.branchId) {
      return this.snackbar.open('Chưa chọn đơn vị', '', { duration: 1500 });
    }
    const val = this.formGroup.value;
    const account = {
      username: val.userName,
      password: val.password,
      branchId: this.branchId,
      role: val.role,
      appName: this.localhost === this.localhostEnum.APP_HR ? this.app.HR :
        this.localhost === this.localhostEnum.APP_SELL ? this.app.SELL :
          this.localhost === this.localhostEnum.APP_WAREHOUSE ? this.app.WAREHOUSE : ''
    };
    if (this.data?.isUpdate) {
      this.store.dispatch(AuthActions.updateAccount(
        { id: this.data.account.id, branchId: this.branchId, role: val.role }));
    } else {
      if (val.password2 === val.password) {
        this.store.dispatch(AuthActions.signUp({ accountDTO: account }));
      } else {
        this.isHidden = true;
      }
    }
    this.dialogRef.close();
  }

  onCreateBranch(event: any, branch: Branch) {
    if (event.isUserInput) {
      if (branch.id === 0) {
        this.branchService
          .addOne({ name: this.branchInput.nativeElement.value })
          .subscribe((branch) => (this.branchId = branch.id));
        this.snackbar.open('Đã tạo', '', { duration: 2500 });
      } else {
        this.branchId = branch.id;
      }
    }
  }
}
