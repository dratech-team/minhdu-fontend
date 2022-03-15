import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {TitleDatepickerComponent} from '../title-datepicker/title-datepicker.component';
import {RagePickerComponent} from '../range-datepicker/range-datepicker.component';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'minhdu-fontend-collapse-datepicker',
  templateUrl: 'collapse-datepicker.component.html'
})
export class CollapseDatepickerComponent {
  @Input() title: string = '';
  @Output() onPicker = new EventEmitter<any>();
  formTitlePicker = new FormControl();

  constructor(
    private readonly modal: NzModalService
  ) {
  }

  onTitlePicker($event: any) {
    console.log($event.titleDatepicker)

    this.formTitlePicker.setValue($event.titleDatepicker.title)
    this.onPicker.emit({
      startAt: $event.titleDatepicker.startedAt,
      endedAt: $event.titleDatepicker.endedAt
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
        this.formTitlePicker.setValue('')
        this.onPicker.emit(val);
      }
    });
  }
}
