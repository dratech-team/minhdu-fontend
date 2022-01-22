import { Component, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  template: `
    <div class='row'>
      <div class='col-xs-12 col-12'>
        <input
          type='text'
          class='form-control'
          #dp='bsDatepicker'
          [isOpen]='true'
          (bsValueChange)='onChange($event)'
          [maxDate]='maxDate'
          placement='left'
          bsDatepicker
        />
      </div>
      <div class='col-xs-12 col-12'>
        <button
          class='btn btn-primary font-lg'
          type='submit'
          [mat-dialog-close]='onApply()'
        >
          Xác nhận
        </button>
      </div>
    </div>
  `
})
export class DialogDatePickerComponent {
  @Output() confirm = new EventEmitter();
  maxDate = new Date();
  datetime?: Date;

  onChange(event: Date) {
    this.datetime = event;
  }

  onApply() {
    return this.datetime
  }
}
