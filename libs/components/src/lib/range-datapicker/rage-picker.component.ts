import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'minhdu-fontend-rage-picker',
  templateUrl: 'rage-picker.component.html'
})
export class RagePickerComponent {
  date = null;

  constructor(
    private readonly modalRef: NzModalRef
  ) {
  }

  onChange(result: Date[]): void {
    this.modalRef.close({
      startAt: result[0], endedAt: result[1]
    });
  }
}
