import { Component, EventEmitter, Output } from '@angular/core';
import {
  TitleDatePicker,
  titleDatepicker,
} from '../../../../constants/title-picker.constant';

@Component({
  selector: 'minhdu-fontend-title-datepicker',
  templateUrl: 'title-datepicker.component.html',
})
export class TitleDatepickerComponent {
  @Output() pickTitle = new EventEmitter<any>();
  optionDataPicker: TitleDatePicker[] = titleDatepicker;

  onSubmit(titleDatepicker: any) {
    this.pickTitle.emit(titleDatepicker);
  }
}
