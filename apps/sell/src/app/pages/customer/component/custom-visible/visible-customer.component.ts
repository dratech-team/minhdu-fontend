import {Component} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {CustomerQuery} from "../../+state/customer.query";
import {CustomerStore} from "../../+state/customer.store";

@Component({
  selector: 'minhdu-fontend-pinned-customer',
  templateUrl: 'visible-customer.component.html'
})
export class VisibleCustomerComponent {
  ui$ = this.customerQuery.select(state => state.ui);
  formGroup!: UntypedFormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly customerQuery: CustomerQuery,
    private readonly customerStore: CustomerStore
  ) {
  }

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = visibleEntity;
  }

  onUpdateVisible() {
    this.customerStore.updateUI(this.visibleEntity, "visible");
  }

  onUpdatePinned() {
    this.customerStore.updateUI(this.visibleEntity, "pinned");
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
