import {Component, Input, OnInit} from "@angular/core";
import {Salary} from "@minhdu-fontend/data-models";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {Payroll} from "../../../../../hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {observable, Observable} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'minhdu-fontend-permanent-salary',
  templateUrl: 'permanent-salary.component.html'
})
export class PermanentSalaryComponent implements OnInit {
  @Input() data!: {
    update?: {
      salary: Salary
    },
    payroll?: Payroll
    type: SalaryTypeEnum.STAY | SalaryTypeEnum.BASIC,
    datetime?: boolean,
    isHistorySalary?: boolean,
    multiple?: {
      payrollIds: number []
    },
  }
  formGroup!: FormGroup
  salaryType = SalaryTypeEnum
  stepIndex = 0
  templateSalary$ = new Observable<any>() ;
  added$ = new Observable()
  constructor(
    private readonly modalRef: NzModalRef,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
  ) {

  }

  ngOnInit() {
    if(this.data.update){
      this.formGroup = this.formBuilder.group({
        type: [this.data.type,Validators.required],
        title:[this.data.update.salary.title,Validators.required] ,
        price: [this.data.update.salary.price, Validators.required] ,
        rate: [this.data.update.salary?.rate],
        note: [this.data.update.salary?.note],
        datetime:[this.data.update.salary?.datetime],
        payrollIds:[this.data?.multiple?.payrollIds],
      })
    }else{
      this.formGroup = this.formBuilder.group({
        type: [this.data.type,Validators.required],
        title:['',Validators.required] ,
        price: ['',Validators.required] ,
        rate: [this.data?.payroll?.taxed],
        note: [],
        payrollIds:[[this.data.payroll?.id]],
      })
    }

    this.formGroup.get('title')?.valueChanges.subscribe(template => {
      if(template.price === 1){
        this.formGroup.get('title')?.setValue(template.price[0])
      }
    })
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(){
    if(this.formGroup.invalid){
      return
    }
    if(this.data.isHistorySalary){
      return; //api update lịch sử lương cho nhân viên
    }
    if(this.data?.update){
      if(this.data.multiple){
        //update multiple
      }
      //api update
    }else{
      //api add salary
    }
    this.modalRef.close()
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): any {
    // if (this.formGroup.invalid) {
    //   return;
    // }

    if (this.stepIndex > 0 && !this.formGroup.value.payrollIds) {
      return this.message.warning('Chưa chọn Nhân viên');
    }
    this.stepIndex += 1;
  }
}



