import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Role } from '../../../../../enums/hr/role.enum';
import { Localhost } from '../../../../../enums/localhost.enum';
import { App } from '@minhdu-fontend/enums';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthActions } from '@minhdu-fontend/auth';

@Component({
  templateUrl:'register.component.html'
})
export class RegisterComponent implements OnInit{
  localhost = `${window.location.host}`
  role = Role;
  app = App;
  isHidden = false;
  localhostEnum = Localhost;
  formGroup!: FormGroup;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {
  }
  ngOnInit() {

    this.formGroup = this.formBuilder.group(
      {
        userName: ['', Validators.required],
        password: ['', Validators.required],
        password2: ['', Validators.required],
        role: ['', Validators.required],
      }
    )
  }


  onSubmit() {
    const val = this.formGroup.value;
    console.log(val.role);
    if(val.password2 === val.password){
      const account = {
        username: val.userName,
        password: val.password,
        role: val.role,
        app: this.localhost === this.localhostEnum.APP_HR? this.app.HR:
          this.localhost === this.localhostEnum.APP_SELL? this.app.SELL:
            this.localhost === this.localhostEnum.APP_WAREHOUSE? this.app.WAREHOUSE: ''
      }
      this.store.dispatch(AuthActions.signUp(account))
      this.dialogRef.close();
    }else{
      this.isHidden = true
    }
  }
}
