import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  template: `
    <div class="row">
      <div class="col-xs-12 col-12 col-md-4 form-group mb-3">
        <input
          type="text"
          class="form-control"
          #dp="bsDatepicker"
          [isOpen]="true"
          (bsValueChange)="(bsValueChange)"
          bsDatepicker
        />
      </div>
      <div class="col-xs-12 col-12 col-md-3 form-group mb-3">
        <button class="btn btn-success" (click)="onApply()" type="button">
          Cập nhật
        </button>
      </div>
    </div>
  `,
})
export class DialogDatePickerComponent {
  @Output() confirm = new EventEmitter();
  bsValueChange!: Date;

  onApply() {
    this.confirm.emit(this.bsValueChange);
  }
}
