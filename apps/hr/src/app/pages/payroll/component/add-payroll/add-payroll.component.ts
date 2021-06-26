import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { PayrollAction } from '../../+state/payroll.action';
import { chunkByNumber } from 'ngx-bootstrap/carousel/utils';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  templateUrl: 'add-payroll.component.html'
})
export class AddPayrollComponent implements OnInit {
  formGroup!: FormGroup;
  type!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    console.log(this.data)
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required]
    });
  }

  onSubmit() {
    return{
      employeeId: this.data,
      createdAt: new Date(this.formGroup.value.createdAt)
    };
  }


  tabChanged($event: MatTabChangeEvent) {

  }
}
