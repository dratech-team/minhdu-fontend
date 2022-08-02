import { Component, OnInit } from '@angular/core';
import { App, ModeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { appConstant, MethodConstant } from '@minhdu-fontend/constants';
import { Actions } from '@datorama/akita-ng-effects';
import { SystemHistoryQuery } from '../../state/system-history/system-history.query';
import { SystemHistoryActions } from '../../state/system-history/system-history.actions';
import { SystemHistoryStore } from '../../state/system-history/system-history.store';
import { debounceTime, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AccountQuery } from '../../state/account-management/account.query';

@Component({
  templateUrl: 'system-history.component.html'
})
export class systemHistoryComponent implements OnInit {
  systemHistory$ = this.systemHistoryQuery.selectAll();
  loading$ = this.systemHistoryQuery.select((state) => state.loading);
  total$ = this.systemHistoryQuery.select((state) => state.total);
  remain$ = this.systemHistoryQuery.select((state) => state.remain);
  count$ = this.systemHistoryQuery.selectCount();
  currentUser$ = this.accountQuery.selectCurrentUser();

  app = App;
  apps = appConstant.filter((app) => app.value === this.accountQuery.getCurrentUser()?.role?.appName);
  methods = MethodConstant;
  modeEnum = ModeEnum;

  formGroup = new FormGroup({
    search: new FormControl(''),
    id: new FormControl(''),
    appName: new FormControl(this.accountQuery.getCurrentUser()?.role?.appName || ''),
    name: new FormControl(''),
    activity: new FormControl(''),
    description: new FormControl(''),
    ip: new FormControl(''),
    createdAt: new FormControl('')
  });

  compareFN = (o1: any, o2: any) => o1 === o2;

  constructor(
    private readonly actions$: Actions,
    private readonly systemHistoryQuery: SystemHistoryQuery,
    private readonly systemHistoryStore: SystemHistoryStore,
    private readonly activeRouter: ActivatedRoute,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.pipe(debounceTime(500), startWith(this.formGroup.value))
      .subscribe((formGroup) => {
        this.actions$.dispatch(
          SystemHistoryActions.loadAll({
            search: this.mapToLogger(formGroup),
            isSet: true
          })
        );
      });
  }

  onLoadMore() {
    this.actions$.dispatch(
      SystemHistoryActions.loadAll({
        search: this.mapToLogger(this.formGroup.value),
        isSet: false
      })
    );
  }

  private mapToLogger(value: any) {
    return {
      id: value.id,
      appName: value.appName,
      name: value.name,
      activity: value.activity,
      description: value.description,
      ip: value.ip,
      createdAt: value.createdAt
    };
  }
}
