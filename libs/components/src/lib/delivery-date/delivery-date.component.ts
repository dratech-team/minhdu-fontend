import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from "@angular/core";
import {NzModalService} from "ng-zorro-antd/modal";
import {OptionDataPickerComponent} from "../option-datapicker/option-data-picker.component";
import {OptionRangeDataPickerComponent} from "../option-range-datapicker/option-range-data-picker.component";

@Component({
  selector: 'app-delivery-date',
  templateUrl: 'delivery-date.component.html'
})
export class DeliveryDateComponent {
  @Input() title: string = ''
  @Output() eventDatePicker = new EventEmitter<any>()

  constructor(
    private readonly modal: NzModalService,
  ) {
  }

  selectOptionDataPicker() {
    this.modal.create({
      nzTitle: 'Ngày giao hàng',
      nzContent: OptionDataPickerComponent,
      nzFooter: null,
      nzWidth: 'fit-content',
      nzMaskClosable: false
    }).afterClose.subscribe(val =>{
      if (val){
        this.eventDatePicker.emit(val)
      }
    })
  }

  selectOtherOptionDataPicker() {
    this.modal.create({
      nzTitle: 'Chọn từ ngày đến ngày',
      nzContent: OptionRangeDataPickerComponent,
      nzFooter: null,
      nzWidth: 'fit-content',
      nzMaskClosable: false
    }).afterClose.subscribe(val =>{
      if (val){
        this.eventDatePicker.emit(val)
      }
    })
  }
}
