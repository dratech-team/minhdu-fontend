import { Component, EventEmitter, Output } from '@angular/core';
import { titleDatepicker } from '../../../../constants/title-picker.constant';

@Component({
  selector: 'minhdu-fontend-title-datepicker',
  templateUrl: 'title-datepicker.component.html'
})
export class TitleDatepickerComponent {
  @Output() pickTitle = new EventEmitter<{
    title: string;
    start: Date;
    end: Date;
  }>();
  optionDataPicker = titleDatepicker;

  onSubmit(titleDatepicker: {
    title: string;
    start: Date;
    end: Date;
  }) {
    if(titleDatepicker) {
      this.pickTitle.emit(titleDatepicker);
    }
  }
}
