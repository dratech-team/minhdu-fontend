import { Component, OnInit } from '@angular/core';
import { ActivityType, App } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { selectorAllSystemHistory } from '../+state/system-history.selectors';
import { SystemHistoryActions } from '../+state/system-history.actions';
import { debounceTime, tap } from 'rxjs/operators';
import { document } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'system-history.container.html'
})
export class SystemHistoryContainer implements OnInit {
  app = App;
  pageSize = 30;
  pageIndex = 1;
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

  ngOnInit(): void {
    const btnRoute = document.getElementById('systemHistory');
    btnRoute?.classList.add('btn-border');
    this.store.dispatch(SystemHistoryActions.loadSystemHistory(
      { take: this.pageSize, skip: this.pageIndexInit }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            SystemHistoryActions.loadSystemHistory(this.systemHistory(val, this.pageSize, this.pageIndexInit))
          );
        })
      )
      .subscribe();

  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      SystemHistoryActions.loadSystemHistory(
        this.systemHistory(val, this.pageSize, this.pageIndex)
      )
    );
  }

  systemHistory(val: any, pageSize: number, pageIndex: number) {
    pageIndex === 0 ? this.pageIndex = 1 : this.pageIndex++;
    return {
      skip: pageSize * pageIndex,
      take: this.pageSize,
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
