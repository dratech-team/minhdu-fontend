import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'modal-note.component.html',
})
export class ModalNoteComponent implements OnInit{
  @Input() data?: {noteInit?: string}
  formGroup!: FormGroup

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef
  ) {}

    ngOnInit() {
    this.formGroup = this.formBuilder.group({
      note: [this.data?.noteInit]
    })
    }
    onSubmit(){
    this.modalRef.close(this.formGroup.value.note)
    }
}
