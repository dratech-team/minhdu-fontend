import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RouteQuery} from "../../+state/route.query";
import {RouteStore} from "../../+state/route.store";

@Component({
  selector: 'minhdu-fontend-pinned-route',
  templateUrl: 'visible-route.component.html'
})
export class VisibleRouteComponent {
  ui$ = this.routeQuery.select(state => state.ui);
  formGroup!: FormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore
  ) {
  }

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = visibleEntity;
  }

  onUpdateVisible() {
    this.routeStore.updateUI(this.visibleEntity, 'visible');
  }

  onUpdatePinned() {
    this.routeStore.updateUI(this.visibleEntity,'pinned');
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
