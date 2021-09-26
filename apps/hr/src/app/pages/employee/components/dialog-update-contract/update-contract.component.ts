import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../../../../reducers';
import { Store } from '@ngrx/store';
import { ContractService } from '../../../../../../../../libs/employee/src/lib/+state/service/contract.service';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { DatePipe } from '@angular/common';



@Component({
  templateUrl: 'update-contract.component.html'
})
export class UpdateContractComponent implements OnInit{
  formGroup!: FormGroup;
  lastContract!: number
  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private  readonly contractService: ContractService
  ) {
  }

  ngOnInit() {
    //FIXME m?i làm tru?ng h?p h?p d?ng m?i nh?t

    if(this.data?.contracts){
      this.lastContract =  this.data?.contracts.length -1
    }
    this.formGroup = this.formBuilder.group({
      createdAt: [
        this.datePipe.transform( this.data?.contracts[this.lastContract]?.createdAt, 'yyyy-MM-dd')
       , Validators.required],
      expiredAt :[
        this.datePipe.transform( this.data?.contracts[this.lastContract]?.expiredAt, 'yyyy-MM-dd'),
        Validators.required],
    }
  )
  }

  onSubmit() {
    const contract = {
      employeeId: this.data.id,
      createdAt: this.formGroup.value.createdAt,
      expiredAt : this.formGroup.value.expiredAt
    }
    if(this.data?.contracts?.length > 0 ){
      this.contractService.update(this.data.contracts[this.lastContract].id, contract).subscribe(_ =>{
        this.store.dispatch(EmployeeAction.getEmployee({id:this.data.id}))
      })
    }else{
      console.log(contract)
      this.contractService.addOne(contract).subscribe(_ =>{
        this.store.dispatch(EmployeeAction.getEmployee({id:this.data.id}))
      })
    }

  }
}
