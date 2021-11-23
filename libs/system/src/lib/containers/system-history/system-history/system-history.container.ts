import { Component, OnInit } from '@angular/core';
import { ActivityType, App, MenuEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { debounceTime, tap } from 'rxjs/operators';
import {
  selectedSystemHistoryLoaded,
  selectorAllSystemHistory
} from '../../../+state/system-history/system-history/system-history.selectors';
import { SystemHistoryActions } from '../../../+state/system-history/system-history/system-history.actions';
import { appConstant, MethodConstant } from '@minhdu-fontend/constants';
import { MainAction } from '../../../../../../../apps/sell/src/app/states/main.action';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'system-history.container.html'
})
export class SystemHistoryContainer implements OnInit {
  app = App;
  apps = appConstant;
  methods = MethodConstant;
  pageSize = 30;
  pageIndexInit = 0;
  activityType = ActivityType;
  formGroup = new FormGroup({
    id: new FormControl(''),
    appName: new FormControl(''),
    name: new FormControl(''),
    activity: new FormControl(''),
    description: new FormControl(''),
    ip: new FormControl(''),
    createdAt: new FormControl('')
  });

  constructor(
    private readonly store: Store
  ) {
  }

  systemHistory$ = this.store.pipe(select(selectorAllSystemHistory));
  loaded$ = this.store.pipe(select(selectedSystemHistoryLoaded));

  ngOnInit(): void {
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.SYSTEM_HISTORY}))
    this.store.dispatch(SystemHistoryActions.loadSystemHistory(
      { take: this.pageSize, skip: this.pageIndexInit }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            SystemHistoryActions.loadSystemHistory(
              this.systemHistory(val))
          );
        })
      )
      .subscribe();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      SystemHistoryActions.loadMoreSystemHistory(
        this.systemHistory(val)
      )
    );
  }

  systemHistory(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      id: val.id,
      appName: val.appName,
      name: val.name,
      activity: val.activity,
      description: val.description,
      ip: val.ip,
      createdAt: val.createdAt
    };
  }
}
