import {Component, OnInit} from "@angular/core";
import {NzModalRef} from "ng-zorro-antd/modal";
import {OptionDataPicker, OptionDataPickerConstant} from "@minhdu-fontend/constants";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector:'option-data-picker',
  templateUrl: 'option-data-picker.component.html'
})
export class OptionDataPickerComponent{
  optionDataPicker: OptionDataPicker[] = OptionDataPickerConstant

  constructor(
    private readonly modalRef: NzModalRef
  ) {
  }

  onSubmit(startAt: Date, endedAt: Date) {
    this.modalRef.close({
      startAt, endedAt
    })
  }
}
