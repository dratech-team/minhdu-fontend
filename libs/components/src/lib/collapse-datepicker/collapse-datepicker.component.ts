import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RangeDay } from '@minhdu-fontend/data-models';
import { DatePipe } from '@angular/common';
import { TitleDatetime } from '@minhdu-fontend/constants';

@Component({
  selector: 'md-collapse-datepicker',
  templateUrl: 'collapse-datepicker.component.html'
})
export class CollapseDatepickerComponent implements OnInit {
  @Input() title: string = '';
  @Input() rangeDayInit?: RangeDay;
  @Output() onCalendarChange = new EventEmitter<Pick<TitleDatetime, 'start' | 'end'>>();

  tooltip = '';

  formTitlePicker = new FormControl();
  formRadio = new FormControl(1);
  visible = false;

  constructor(
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    if (this.rangeDayInit?.start && this.rangeDayInit?.end) {
      this.tooltip = `Từ ${this.datePipe.transform(this.rangeDayInit.start, 'dd/MM/YYYY')} tới ${this.datePipe.transform(this.rangeDayInit.end, 'dd/MM/YYYY')}`;
    }
  }

  onTitlePicker(picker: TitleDatetime) {
    this.visible = false;
    this.formRadio.setValue(0);
    this.formTitlePicker.setValue(picker.title);
    this.onCalendarChange.emit({
      start: picker.start,
      end: picker.end
    });
    if (picker.start && picker.end) {
      this.tooltip = `Từ ${this.datePipe.transform(picker.start, 'dd/MM/YYYY')} tới ${this.datePipe.transform(picker.end, 'dd/MM/YYYY')}`;
    } else {
      this.tooltip = '';
    }
  }

  onChange(date: (Date | null)[]) {
    this.formRadio.setValue(1);
    if (date && date[0] && date[1]) {
      this.onCalendarChange.emit({
        start: date[0],
        end: date[1]
      });
      this.tooltip = date[0] && date[1]
        ? `Từ ${this.datePipe.transform(date[0], 'dd/MM/YYYY')} tới ${this.datePipe.transform(date[1], 'dd/MM/YYYY')}`
        : '';
    }
  }
}
