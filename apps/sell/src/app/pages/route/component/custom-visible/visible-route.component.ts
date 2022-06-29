import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { RouteQuery, RouteStore } from '../../+state';

@Component({
  selector: 'minhdu-fontend-pinned-route',
  templateUrl: 'visible-route.component.html',
})
export class VisibleRouteComponent {
  ui$ = this.routeQuery.select((state) => state.ui);
  formGroup!: UntypedFormGroup;
  visibleEntity: any = {};

  constructor(
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore
  ) {}

  onVisibleChange(visible: boolean, visibleEntity: any) {
    this.visibleEntity = visibleEntity;
  }

  onUpdateVisible() {
    this.routeStore.updateUI(this.visibleEntity, 'visible');
  }

  onUpdatePinned() {
    this.routeStore.updateUI(this.visibleEntity, 'pinned');
  }

  visible(key: 'visible' | 'pinned'): boolean {
    return this.visibleEntity[Object.keys(this.visibleEntity).toString()][key];
  }
}
