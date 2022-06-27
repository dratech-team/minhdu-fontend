import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'modal-note.component.html',
})
export class ModalNoteComponent implements OnInit {
  @Input() data?: { noteInit?: string }
  formGroup!: UntypedFormGroup

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      note: [this.data?.noteInit]
    })
  }

  onSubmit() {
    this.modalRef.close(this.formGroup.value.note)
  }
}
