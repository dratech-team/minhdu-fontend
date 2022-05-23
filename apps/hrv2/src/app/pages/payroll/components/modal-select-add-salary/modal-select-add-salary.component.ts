import {Component} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {PermanentSalaryComponent} from "../../../salary/components/permanent/permanent-salary.component";
import {ModalAddOrUpdatePermanent} from "../../data";

@Component({
  templateUrl: 'modal-selct-add-Salary.html'
})
export class ModalSelectAddSalaryComponent {
  salaryType = SalaryTypeEnum

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly modal: NzModalService
  ) {
  }

  selectTypeAddMultiple(salaryType: SalaryTypeEnum): any {
    this.modal.create({
      nzTitle: 'Thêm ' + (salaryType === SalaryTypeEnum.STAY ? 'phụ cấp lương' : 'lương cơ bản'),
      nzContent: PermanentSalaryComponent,
      nzComponentParams: <{ data: ModalAddOrUpdatePermanent }>{
        data: {
          type: salaryType,
          add: {
            multiple: true
          }
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.modalRef.close(val)
      }
    })
  }
}
