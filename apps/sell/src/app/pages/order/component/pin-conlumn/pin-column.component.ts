import {Component, EventEmitter, Input, Output} from "@angular/core";
import {OrderVisibleEntity} from "../../enitities/order-visible.entity";
import {FormGroup} from "@angular/forms";
import {OrderStore} from "../../+state/order.store";

@Component({
  selector: 'minhdu-fontend-pin-column-order',
  templateUrl: 'pin-column.component.html'
})
export class PinColumnComponent {
  @Input() ui!: OrderVisibleEntity
  @Output() closePopover = new EventEmitter()
  formGroup!: FormGroup
  visibleEntity: any = {};

  constructor(
    private readonly orderStore: OrderStore,
  ) {
  }

  onClose() {
    this.closePopover.emit()
  }

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = visibleEntity;
  }

  onUpdateVisible(visible: boolean) {
    this.visibleEntity.visible = !visible
    this.orderStore.updateUI(this.visibleEntity)
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
