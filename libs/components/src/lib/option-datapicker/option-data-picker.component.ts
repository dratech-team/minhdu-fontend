import {Component, OnInit} from "@angular/core";
import {NzModalRef} from "ng-zorro-antd/modal";
import {OptionDataPicker, OptionDataPickerConstant} from "@minhdu-fontend/constants";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  templateUrl: 'option-data-picker.component.html'
})
export class OptionDataPickerComponent{
  optionDataPicker: OptionDataPicker[] = OptionDataPickerConstant

  constructor(
    private readonly dlaogRef: MatDialogRef<OptionDataPickerComponent>
  ) {
  }

  onSubmit(startAt: Date, endedAt: Date) {
    this.dlaogRef.close({
      startAt, endedAt
    })
  }
}
