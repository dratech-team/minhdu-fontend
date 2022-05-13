import {Component, OnInit} from '@angular/core';
import {ActivityType, App} from '@minhdu-fontend/enums';
import {FormControl, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {debounceTime, tap} from 'rxjs/operators';
import {appConstant, MethodConstant} from '@minhdu-fontend/constants';
import {getSelectors} from "@minhdu-fontend/utils";

@Component({
  templateUrl: 'system-history.container.html',
})
export class SystemHistoryContainer implements OnInit {
  // systemHistory$ = this.store.pipe(select(selectorAllSystemHistory));
  // loaded$ = this.store.pipe(select(selectedSystemHistoryLoaded));
  // total$ = this.store.pipe(select(selectedTotalSystemHistory));
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



  ngOnInit(): void {
  }

  onPagination(pageIndex: number) {
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
