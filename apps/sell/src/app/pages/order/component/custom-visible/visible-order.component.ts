import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { OrderQuery, OrderStore } from '../../state';

@Component({
  selector: 'minhdu-fontend-pin-column-order',
  templateUrl: 'visible-order.component.html',
})
export class VisibleOrderComponent {
  ui$ = this.orderQuery.select((state) => state.ui);
  formGroup!: UntypedFormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore
  ) {}

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = visibleEntity;
  }

  onUpdateVisible() {
    this.orderStore.updateUI(this.visibleEntity, 'visible');
  }

  onUpdatePinned() {
    this.orderStore.updateUI(this.visibleEntity, 'pinned');
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
