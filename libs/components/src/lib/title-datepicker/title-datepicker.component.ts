import { Component, EventEmitter, Output } from '@angular/core';
import { titleDatepicker, TitleDatetime } from '@minhdu-fontend/constants';

@Component({
  selector: 'md-title-datepicker',
  templateUrl: 'title-datepicker.component.html'
})
export class TitleDatepickerComponent {
  @Output() pickTitle = new EventEmitter<TitleDatetime>();
  optionDataPicker = titleDatepicker;

  onSubmit(titleDatepicker: TitleDatetime) {
    if (titleDatepicker) {
      this.pickTitle.emit(titleDatepicker);
    }
  }
}
