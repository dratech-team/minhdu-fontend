import {Component, OnInit} from "@angular/core";
import {NzModalRef} from "ng-zorro-antd/modal";
import {optionDataPicker, OptionDataPickerConstant} from "@minhdu-fontend/constants";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  templateUrl: 'option-range-data-picker.component.html'
})
export class OptionRangeDataPickerComponent{
  date = null
  constructor(
    private readonly dlaogRef: MatDialogRef<OptionRangeDataPickerComponent>
  ) {
  }

  onChange(result: Date[]): void {
    this.dlaogRef.close({
      startAt : result[0], endedAt: result[1]
    })
  }
}
