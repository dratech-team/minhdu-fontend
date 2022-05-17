import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AccountService} from "../../../../../system/src/lib/services/account.service";

@Component({
  templateUrl: 'dialog-change-password.html'
})
export class DialogChangePassword implements OnInit {
  fromGroup!: FormGroup;
  submitted = false;
  isHidden = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AccountService,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef:MatDialogRef<DialogChangePassword>,
  ) {
  }

  ngOnInit() {
    this.fromGroup = this.formBuilder.group({
      password: [undefined, Validators.required],
      password2: [undefined, Validators.required]
    });
  }

  get checkValid() {
    return this.fromGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.fromGroup.valid) {
      const val = this.fromGroup.value;
      if (val.password === val.password2) {
        const id = parseInt(<string>localStorage.getItem('idAccount'));
        this.accountService.updatePassword(id, { password: val.password }).subscribe(val => {
          this.snackBar.open(val.message, '', { duration: 1500 });
          this.dialogRef.close()
        });
      } else {
        this.isHidden = true;
      }
    } else {
      return;
    }
  }
}
