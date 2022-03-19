import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'minhdu-fontend-collapse-datepicker',
  templateUrl: 'collapse-datepicker.component.html'
})
export class CollapseDatepickerComponent implements  OnInit{
  @Input() title: string = '';
  @Output() onPicker = new EventEmitter<any>();
  formTitlePicker = new FormControl();
  formRange = new FormControl();
  formRadio = new FormControl()
  visible = false
  ngOnInit() {
    this.formRange.valueChanges.subscribe(val => {
      this.formRadio.setValue(1)
      this.onPicker.emit({
        startedAt: val[0], endedAt: val[1]
      });
    })
  }

  onTitlePicker($event: any) {
    this.visible = false
    this.formTitlePicker.setValue($event.titleDatepicker.title)
    this.onPicker.emit({
      startedAt: $event.titleDatepicker.startedAt,
      endedAt: $event.titleDatepicker.endedAt
    });
  }
}
