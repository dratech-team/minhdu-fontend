import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DatePipe} from "@angular/common";
import {ModalDatePickerEntity} from "@minhdu-fontend/base-entity";

@Component({
  templateUrl: './modal-date-picker.component.html',
})
export class ModalDatePickerComponent implements OnInit {
  @Input() data!: ModalDatePickerEntity
  formDatePicker = new FormControl('')

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    if (this.data?.dateInit)
      this.formDatePicker.setValue(this.datePipe.transform(this.data.dateInit, 'yyyy-MM-dd'))
  }

  onSubmit() {
    this.modalRef.close(this.formDatePicker.value)
  }
}
