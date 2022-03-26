import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ProductQuery} from "../../state/product.query";
import {ProductStore} from "../../state/product.store";

@Component({
  selector: 'minhdu-fontend-pinned-product',
  templateUrl: 'visible-product.component.html'
})
export class VisibleProductComponent {
  ui$ = this.productQuery.select(state => state.ui);
  formGroup!: FormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly productQuery: ProductQuery,
    private readonly productStore: ProductStore
  ) {
  }

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = visibleEntity;
  }

  onUpdateVisible() {
    this.productStore.updateUI(this.visibleEntity,'visible');
  }

  onUpdatePinned() {
    this.productStore.updateUI(this.visibleEntity,'pinned');
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
