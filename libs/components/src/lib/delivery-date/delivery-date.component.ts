import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from "@angular/core";
import {NzModalService} from "ng-zorro-antd/modal";
import {OptionDataPickerComponent} from "../option-datapicker/option-data-picker.component";
import {MatDialog} from "@angular/material/dialog";
import {OptionRangeDataPickerComponent} from "../option-range-datapicker/option-range-data-picker.component";

@Component({
  selector: 'app-delivery-date',
  templateUrl: 'delivery-date.component.html'
})
export class DeliveryDateComponent {
  @Input() title: string = ''
  @Output() eventDataPicker = new EventEmitter<any>()

  constructor(
    private readonly modal: NzModalService,
    private readonly dialog: MatDialog,
  ) {
  }

  selectOptionDataPicker() {
    this.dialog.open(OptionDataPickerComponent).afterClosed().subscribe(val => {
      if (val) {
        this.eventDataPicker.emit(val)
      }
    })
  }

  selectOtherOptionDataPicker() {
    this.dialog.open(OptionRangeDataPickerComponent).afterClosed().subscribe(val => {
      if (val) {
        this.eventDataPicker.emit(val)
      }
    })
  }
}
