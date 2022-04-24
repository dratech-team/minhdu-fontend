import {Component, Input} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'modal-alert.component.html',
})
export class ModalAlertComponent {
  @Input() data!: {
    description: string,
  }
  constructor(
    private readonly modalRef: NzModalRef
  ) {}
  onSubmit(){
    this.modalRef.close(true)
  }
}
