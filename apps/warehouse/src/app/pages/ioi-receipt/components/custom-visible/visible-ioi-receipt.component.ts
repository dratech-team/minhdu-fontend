import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IoiReceiptQuery } from '../../state/ioi-receipt.query';
import { IoiReceiptStore } from '../../state/ioi-receipt.store';

@Component({
  selector: 'minhdu-fontend-pinned-ioi-receipt',
  templateUrl: 'visible-ioi-receipt.component.html',
})
export class VisibleIoiReceiptComponent {
  ui$ = this.ioiReceiptQuery.select((state) => state.ui);
  formGroup!: UntypedFormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly ioiReceiptQuery: IoiReceiptQuery,
    private readonly ioiReceiptStore: IoiReceiptStore
  ) {}

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = visibleEntity;
  }

  onUpdateVisible() {
    this.ioiReceiptStore.updateUI(this.visibleEntity, 'visible');
  }

  onUpdatePinned() {
    this.ioiReceiptStore.updateUI(this.visibleEntity, 'pinned');
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
