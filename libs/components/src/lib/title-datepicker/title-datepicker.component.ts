import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TitleDatePicker, titleDatepicker } from '../../../../constants/title-picker.constant';

@Component({
  selector: 'minhdu-fontend-title-datepicker',
  templateUrl: 'title-datepicker.component.html'
})
export class TitleDatepickerComponent {
  optionDataPicker: TitleDatePicker[] = titleDatepicker;

  constructor(
    private readonly modalRef: NzModalRef
  ) {
  }

  onSubmit(startAt: Date, endedAt: Date) {
    this.modalRef.close({
      startAt, endedAt
    });
  }
}
