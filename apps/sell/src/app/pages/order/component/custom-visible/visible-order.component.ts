import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {OrderStore} from '../../+state/order.store';
import {OrderQuery} from '../../+state/order.query';

@Component({
  selector: 'minhdu-fontend-pin-column-order',
  templateUrl: 'visible-order.component.html'
})
export class VisibleOrderComponent {
  ui$ = this.orderQuery.select(state => state.ui);
  formGroup!: FormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore
  ) {
  }

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = JSON.parse(JSON.stringify(visibleEntity));
  }

  onUpdateVisible() {
    this.visibleEntity[Object.keys(this.visibleEntity).toString()].visible = !this.visibleEntity[Object.keys(this.visibleEntity).toString()].visible
    this.orderStore.updateUI(this.visibleEntity);
  }

  onUpdatePinned() {
    this.visibleEntity[Object.keys(this.visibleEntity)
      .toString()].pinned = !this.visibleEntity[Object.keys(this.visibleEntity).toString()].pinned
    this.orderStore.updateUI(this.visibleEntity);
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
