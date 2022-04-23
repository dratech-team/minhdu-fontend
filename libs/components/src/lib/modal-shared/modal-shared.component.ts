import {Component, Input} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'modal-shared.component.html',
})
export class ModalSharedComponent {
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
