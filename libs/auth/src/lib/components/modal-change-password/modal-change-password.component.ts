import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from "../../../../../system/src/lib/services/account.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {catchError} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd/message";
import {throwError} from "rxjs";

@Component({
  templateUrl: 'modal-change-password.component.html'
})
export class ModalChangePasswordComponent implements OnInit {
  fromGroup!: FormGroup;
  isHidden = false;
  summiting = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AccountService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalRef,
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
    if (this.fromGroup.valid) {
      const val = this.fromGroup.value;
      if (val.password === val.password2) {
        const id = parseInt(<string>localStorage.getItem('idAccount'));
        this.summiting = true
        this.accountService.updatePassword(id, { password: val.password })
          .pipe(catchError(err => {
            this.summiting = false
            this.message.success(err)
            return throwError(err)
          }))
          .subscribe(val => {
            this.summiting = false
          this.message.success(val.message);
          this.modal.close()
        });
      } else {
        this.isHidden = true;
      }
    } else {
      return;
    }
  }
}
