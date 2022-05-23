import {Component, Input} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";

@Component({
  templateUrl: 'modal-update-closed-commodity.component.html',
})
export class ModalUpdateClosedCommodityComponent {
  @Input() data!: ModalAlertEntity

  constructor(
    private readonly modalRef: NzModalRef
  ) {
  }

  onSubmit(save: boolean) {
    this.modalRef.close({save})
  }
}
