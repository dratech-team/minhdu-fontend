import {Component, OnInit} from "@angular/core";
import {NzModalRef} from "ng-zorro-antd/modal";
import {optionDataPicker, OptionDataPickerConstant} from "@minhdu-fontend/constants";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  templateUrl: 'option-data-picker.component.html'
})
export class OptionDataPickerComponent{
  optionDataPicker: optionDataPicker[] = OptionDataPickerConstant

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
