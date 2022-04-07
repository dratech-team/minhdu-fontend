import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {StockQuery} from "../../state/stock.query";
import {StockStore} from "../../state/stock.store";

@Component({
  selector: 'minhdu-fontend-pinned-product',
  templateUrl: 'visible-stock.component.html'
})
export class VisibleStockComponent {
  ui$ = this.productQuery.select(state => state.ui);
  formGroup!: FormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly productQuery: StockQuery,
    private readonly productStore: StockStore
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
