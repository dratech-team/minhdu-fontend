import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TitleDatepickerComponent } from '../title-datepicker/title-datepicker.component';
import { RagePickerComponent } from '../range-datepicker/range-datepicker.component';

@Component({
  selector: 'minhdu-fontend-collapse-datepicker',
  templateUrl: 'collapse-datepicker.component.html'
})
export class CollapseDatepickerComponent {
  @Input() title: string = '';
  @Output() onPicker = new EventEmitter<any>();

  constructor(
    private readonly modal: NzModalService
  ) {
  }

  onTitlePicker() {
    this.modal.create({
      nzTitle: 'Ngày giao hàng',
      nzContent: TitleDatepickerComponent,
      nzFooter: null,
      nzWidth: 'fit-content',
      nzMaskClosable: false
    }).afterClose.subscribe(val => {
      if (val) {
        this.onPicker.emit(val);
      }
    });
  }

  onRage() {
    this.modal.create({
      nzTitle: 'Chọn từ ngày đến ngày',
      nzContent: RagePickerComponent,
      nzFooter: null,
      nzWidth: 'fit-content',
      nzMaskClosable: false
    }).afterClose.subscribe(val => {
      if (val) {
        this.onPicker.emit(val);
      }
    });
  }
}
