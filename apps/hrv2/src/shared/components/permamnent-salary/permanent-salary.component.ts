import {Component, Input, OnInit} from "@angular/core";
import {Salary} from "@minhdu-fontend/data-models";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {Observable} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {DatePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'minhdu-fontend-permanent-salary',
  templateUrl: 'permanent-salary.component.html'
})
export class PermanentSalaryComponent implements OnInit {
  @Input() data!: {
    update?: {
      salaryIds: number []
    },
    type: SalaryTypeEnum.STAY | SalaryTypeEnum.BASIC | SalaryTypeEnum.HISTORY ,
  }
  formGroup!: FormGroup
  salaryType = SalaryTypeEnum
  stepIndex = 0
  templateSalaries$ = new Observable<any>();
  added$ = new Observable()
  constructor(
    private readonly modalRef: NzModalRef,
    private readonly activatedRoute: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
  ) {

  }

  ngOnInit() {
    if(this.data.update){
      this.formGroup = this.formBuilder.group({
        // type: [this.data.type,Validators.required],
        // title:[salary.title,Validators.required] ,
        // price: [salary.price, Validators.required] ,
        // rate: [salary.rate],
        // note: [salary.note],
        // datetime:[this.data.type === SalaryTypeEnum.HISTORY ?
        //   this.datePipe.transform(salary.datetime, 'yyyy-MM-dd') : ''],
        // payrollIds:[this.data.update.salaries.map(salary => salary.PayrollId)],
      })
    }else{
      this.formGroup = this.formBuilder.group({
        type: [this.data.type,Validators.required],
        title:['',Validators.required] ,
        price: ['',Validators.required] ,
        rate: [],
        note: [],
        payrollIds:[this.payrollId],
      })
    }

    this.formGroup.get('title')?.valueChanges.subscribe(template => {
      if(template.price === 1){
        this.formGroup.get('title')?.setValue(template.price[0])
      }
    })
  }

  get payrollId():number{
    return +this.activatedRoute.snapshot.params.id
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(){
    if(this.formGroup.invalid){
      return
    }
    if(this.data.type === SalaryTypeEnum.HISTORY){
      return; //api update lịch sử lương cho nhân viên
    }
    if(this.data?.update){
     return; //api update
    }else{
      return;//api add salary
    }
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



