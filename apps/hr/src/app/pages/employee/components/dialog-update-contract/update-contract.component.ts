import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../../../../reducers';
import { Store } from '@ngrx/store';
import { ContractService } from '../../../../../../../../libs/employee/src/lib/+state/service/contract.service';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { map, tap } from 'rxjs/operators';


@Component({
  templateUrl: 'update-contract.component.html'
})
export class UpdateContractComponent implements OnInit{
  formGroup!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private  readonly contractService: ContractService
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      createdAt: [this.data, Validators.required],
      expiredAt :[this.data, Validators.required],
    }
  )
  }

  onSubmit() {
    const contract = {
      employeeId: this.data.id,
      createdAt: this.formGroup.value.createdAt,
      expiredAt : this.formGroup.value.expiredAt
    }
    this.contractService.addOne(contract).subscribe()
  }
}
