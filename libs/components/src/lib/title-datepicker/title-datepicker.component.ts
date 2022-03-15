import {Component, OnInit} from "@angular/core";
import {NzModalRef} from "ng-zorro-antd/modal";
import {OptionDataPicker, OptionDataPickerConstant} from "@minhdu-fontend/constants";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector:'minhdu-fontend-title-datepicker',
  templateUrl: 'title-datepicker.component.html'
})
export class TitleDatepickerComponent {
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
