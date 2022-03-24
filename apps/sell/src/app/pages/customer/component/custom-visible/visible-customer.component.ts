import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CustomerQuery} from "../../+state/customer.query";
import {CustomerStore} from "../../+state/customer.store";

@Component({
  selector: 'minhdu-fontend-pinned-customer',
  templateUrl: 'visible-customer.component.html'
})
export class VisibleCustomerComponent {
  ui$ = this.customerQuery.select(state => state.ui);
  formGroup!: FormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly customerQuery: CustomerQuery,
    private readonly customerStore: CustomerStore
  ) {
  }

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = JSON.parse(JSON.stringify(visibleEntity));
  }

  onUpdateVisible() {
    this.visibleEntity[Object.keys(this.visibleEntity).toString()].visible = !this.visibleEntity[Object.keys(this.visibleEntity).toString()].visible
    this.customerStore.updateUI(this.visibleEntity);
  }

  onUpdatePinned() {
    this.visibleEntity[Object.keys(this.visibleEntity)
      .toString()].pinned = !this.visibleEntity[Object.keys(this.visibleEntity).toString()].pinned
    this.customerStore.updateUI(this.visibleEntity);
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
