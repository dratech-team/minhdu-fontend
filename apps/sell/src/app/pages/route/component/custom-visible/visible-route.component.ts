import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouteQuery, RouteStore } from '../../state';
import { VisibleEntity } from '@minhdu-fontend/data-models';

@Component({
  selector: 'minhdu-fontend-pinned-route',
  templateUrl: 'visible-route.component.html'
})
export class VisibleRouteComponent {
  ui$ = this.routeQuery.select((state) => state.ui);
  formGroup!: FormGroup;
  visibleEntity: VisibleEntity = { visible: true, pinned: false };
  visible = (key: 'visible' | 'pinned') => this.visibleEntity[key];

  constructor(
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore
  ) {
  }

  onPopoverVisibleChange(visible: boolean, visibleEntity: VisibleEntity) {
    this.visibleEntity = visibleEntity;
  }

  onChange(key: 'visible' | 'pinned', visible: boolean) {
    let newVisible: VisibleEntity;
    if (key === 'visible') {
      newVisible = { ...this.visibleEntity, visible: visible };
    } else {
      newVisible = { ...this.visibleEntity, pinned: visible };
    }
    this.routeStore.updateUI(newVisible);
  }
}
