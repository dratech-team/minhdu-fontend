import {Component, Input} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";

@Component({
  templateUrl: 'modal-alert.component.html',
})
export class ModalAlertComponent {
  @Input() data!: ModalAlertEntity

  constructor(
    private readonly modalRef: NzModalRef
  ) {
  }

  onSubmit() {
    this.modalRef.close(true)
  }
}
