import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ContractService} from "../../../../../../../../libs/employee-v2/src/lib/employee/services/contract.service";
import {Actions} from "@datorama/akita-ng-effects";
import {EmployeeActions} from "@minhdu-fontend/employee-v2";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {ContractEntity} from "../../../../../../../../libs/employee-v2/src/lib/employee/entities/contract.entity";


@Component({
  templateUrl: 'modal-update-contract.component.html'
})
export class ModalUpdateContractComponent implements OnInit {
  @Input() data!: {
    employeeId: number
    contracts: ContractEntity [],
  }
  submitting = false
  formGroup!: FormGroup;

  constructor(
    public datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    private readonly modal: NzModalService,
    private readonly modalRef: NzModalRef,
    private readonly contractService: ContractService,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
        createdAt: [this.data.contracts.slice(-1)[0]?.createdAt, Validators.required],
        expiredAt: [this.data.contracts.slice(-1)[0]?.expiredAt, Validators.required]
      }
    );
  }

  onSubmit() {
    const contract = {
      employeeId: this.data.employeeId,
      createdAt: this.formGroup.value.createdAt,
      expiredAt: this.formGroup.value.expiredAt
    };
    this.submitting = true
    if (this.data.contracts?.length > 0) {
      this.contractService.update(this.data.contracts.slice(-1)[0].id, contract).pipe(
        catchError(err => {
          return this.onSubmitError(err)
        })
      ).subscribe(_ => {
        this.onSubmitSuccess()
      });
    } else {
      this.contractService.addOne(contract).pipe(
        catchError(err => {
          return this.onSubmitError(err)
        })
      ).subscribe(_ => {
        this.onSubmitSuccess()
      });
    }

  }

  onDelete() {
    this.modal.warning({
      nzTitle: 'Xoá ngày tạo hợp đồng',
      nzContent: 'Bạn có chắc chắn muốn xoá ngày tạo hợp đồng này không',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data.contracts.map((contract: ContractEntity) => {
          this.actions$.dispatch(EmployeeActions.removeContracts({
            id: contract.id,
            employeeId: this.data.employeeId
          }))
        })
        this.modalRef.close()
      }
    })
  }

  private onSubmitError(err: string) {
    this.submitting = true
    return throwError(err)
  }


  private onSubmitSuccess() {
    this.submitting = true
    this.actions$.dispatch(EmployeeActions.loadOne({id: this.data.employeeId}));
    this.modalRef.close()
  }
}
