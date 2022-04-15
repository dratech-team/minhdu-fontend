import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SettingSalaryQuery} from "../../state";
import {SettingSalaryStore} from "../../state";

@Component({
  selector: 'minhdu-fontend-pinned-setting-salary',
  templateUrl: 'visible-setting-salary.component.html'
})
export class VisibleSettingSalaryComponent {
  ui$ = this.productQuery.select(state => state.ui);
  formGroup!: FormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly productQuery: SettingSalaryQuery,
    private readonly productStore: SettingSalaryStore
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
