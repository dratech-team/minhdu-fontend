import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Localhost } from '../../../../../enums/localhost.enum';
import { App } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthActions } from '@minhdu-fontend/auth';
import { Branch } from '@minhdu-fontend/data-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as lodash from 'lodash';
import { RoleService } from '../../services/role.service';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @ViewChild('branchInput') branchInput!: ElementRef;
  localhost = `${window.location.host}`;
  app = App;
  isHidden = false;
  localhostEnum = Localhost;
  formGroup!: FormGroup;
  branchesSelected: Branch[] = [];
  branches = new FormControl();
  branches$ = this.store.pipe(select(getAllOrgchart));
  submitted = false;
  role$!: Observable<any[]>;
  appName!: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly roleService: RoleService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    this.role$ = this.roleService.getAll();
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.isUpdate) {
      this.branchesSelected = [...this.data.account?.branches];
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
          // role2: [],
          // role3: [],
          // role4: [],
          // role5: []
        }
      );
    }


    this.branches$ = combineLatest([
      this.branches.valueChanges.pipe(startWith('')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          return branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
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
    if (this.branchesSelected.length === 0) {
      return this.snackbar.open('Chưa chọn đơn vị', '', { duration: 1500 });
    }
    const val = this.formGroup.value;
    const account = {
      username: val.userName,
      password: val.password,
      branchIds: this.branchesSelected.map(item => {
        return item.id;
      }),
      roleId: val.role.id,
      appName: val.role.appName
    };
    if (this.data?.isUpdate) {
      this.store.dispatch(AuthActions.updateAccount(
        {
          id: this.data.account.id,
          branchIds: this.branchesSelected.map(item => {
            return item.id;
          }),
          roleId: val.role.id
        }));
    } else {
      if (val.password2 === val.password) {
        this.store.dispatch(AuthActions.signUp({ accountDTO: account }));
      } else {
        this.isHidden = true;
      }
    }
    this.dialogRef.close();
  }

  onSelectBranch(event: any, branch: Branch, branchInput: HTMLElement) {
    if (event.isUserInput) {
      if (this.branchesSelected.find(item => item.id === branch.id)) {
        this.snackbar.open('Đơn vị đã được chọn', '', { duration: 1500 });
      } else {
        this.branchesSelected.push(branch);
      }
      setTimeout(() => {
          this.branches.setValue('');
          branchInput.blur();
        }
      );
    }
  }

  removeBranches(branch: Branch) {
    lodash.remove(this.branchesSelected, branch);
  }
}
