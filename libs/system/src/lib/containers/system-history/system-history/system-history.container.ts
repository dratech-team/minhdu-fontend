import { Component, OnInit } from '@angular/core';
import { ActivityType, App, MenuEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { debounceTime, tap } from 'rxjs/operators';
import {
  selectedSystemHistoryLoaded,
  selectedTotalSystemHistory,
  selectorAllSystemHistory, selectorSystemHistoryTotal,
} from '../../../+state/system-history/system-history/system-history.selectors';
import { SystemHistoryActions } from '../../../+state/system-history/system-history/system-history.actions';
import { appConstant, MethodConstant } from '@minhdu-fontend/constants';
import {RouteAction} from "../../../../../../../apps/sell/src/app/pages/route/+state/route.action";
import {getSelectors} from "@minhdu-fontend/utils";
import {
  selectedCreateAtPayroll
} from "../../../../../../../apps/hr/src/app/pages/payroll/+state/payroll/payroll.selector";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'system-history.container.html',
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
    createdAt: new FormControl(''),
  });
  pageSizeTable = 15

  constructor(private readonly store: Store) {}

  systemHistory$ = this.store.pipe(select(selectorAllSystemHistory));
  loaded$ = this.store.pipe(select(selectedSystemHistoryLoaded));
  total$ = this.store.pipe(select(selectedTotalSystemHistory));

  ngOnInit(): void {
    this.store.dispatch(
      SystemHistoryActions.loadSystemHistory({
        take: this.pageSize,
        skip: this.pageIndexInit,
      })
    );
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            SystemHistoryActions.loadSystemHistory(this.mapSystemHistory(val))
          );
        })
      )
      .subscribe();
  }

  onPagination(pageIndex: number) {
    const value = this.formGroup.value
    const count =   getSelectors<number>(selectorSystemHistoryTotal, this.store)
    if (pageIndex * this.pageSizeTable >= count) {
      this.store.dispatch(
        SystemHistoryActions.loadMoreSystemHistory(this.mapSystemHistory(value))
      );
    }
    const val = this.formGroup.value;

  }

  mapSystemHistory(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      id: val.id,
      appName: val.appName,
      name: val.name,
      activity: val.activity,
      description: val.description,
      ip: val.ip,
      createdAt: val.createdAt,
    };
  }
}
