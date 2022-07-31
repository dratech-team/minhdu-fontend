import { Component } from '@angular/core';
import { RouteQuery, RouteStore } from '../../state';
import { VisibleExtendEntity } from '@minhdu-fontend/data-models';

@Component({
  selector: 'minhdu-fontend-pinned-route',
  templateUrl: 'visible-route.component.html'
})
export class VisibleRouteComponent {
  ui$ = this.routeQuery.select((state) => state.ui);

  visibleEntity = this.routeQuery.getValue().ui[0];

  visible = (key: 'visible' | 'pinned') => this.visibleEntity[key];

  constructor(
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore
  ) {
  }

  onPopoverVisibleChange(visible: boolean, visibleEntity: VisibleExtendEntity) {
    this.visibleEntity = visibleEntity;
  }

  onChange(key: 'visible' | 'pinned', visible: boolean) {
    let newVisible: VisibleExtendEntity;
    if (key === 'visible') {
      newVisible = { ...this.visibleEntity, visible: visible };
    } else {
      newVisible = { ...this.visibleEntity, pinned: visible };
    }
    this.routeStore.updateUI(newVisible);
  }
}
