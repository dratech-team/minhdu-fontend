import { Component, OnInit } from '@angular/core';
import { App, ModeEnum } from '@minhdu-fontend/enums';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { appConstant, MethodConstant } from '@minhdu-fontend/constants';
import { Actions } from '@datorama/akita-ng-effects';
import { SystemHistoryQuery } from '../../state/system-history/system-history.query';
import { SystemHistoryActions } from '../../state/system-history/system-history.actions';
import { SystemHistoryStore } from '../../state/system-history/system-history.store';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AccountQuery } from '../../state/account-management/account.query';

@Component({
  templateUrl: 'system-history.component.html',
})
export class systemHistoryComponent implements OnInit {
  systemHistory$ = this.systemHistoryQuery.selectAll();
  loading$ = this.systemHistoryQuery.select((state) => state.loading);
  total$ = this.systemHistoryQuery.select((state) => state.total);
  remain$ = this.systemHistoryQuery.select((state) => state.remain);
  count$ = this.systemHistoryQuery.selectCount();
  currentUser$ = this.accountQuery.selectCurrentUser();

  app = App;
  apps = appConstant;
  methods = MethodConstant;
  pageSize = 30;
  pageIndexInit = 0;
  modeEnum = ModeEnum;

  stateSearch = this.systemHistoryQuery.getValue().search;
  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.stateSearch?.search || ''),
    id: new UntypedFormControl(this.stateSearch?.id || ''),
    appName: new UntypedFormControl(this.stateSearch?.appName || ''),
    name: new UntypedFormControl(this.stateSearch?.name || ''),
    activity: new UntypedFormControl(this.stateSearch?.activity || ''),
    description: new UntypedFormControl(this.stateSearch?.description || ''),
    ip: new UntypedFormControl(this.stateSearch?.ip || ''),
    createdAt: new UntypedFormControl(this.stateSearch?.createdAt || ''),
  });
  pageSizeTable = 15;
  compareFN = (o1: any, o2: any) =>
    o1 && o2 ? o1.value == o2.value : o1 === o2;

  constructor(
    private readonly actions$: Actions,
    private readonly systemHistoryQuery: SystemHistoryQuery,
    private readonly systemHistoryStore: SystemHistoryStore,
    private readonly activeRouter: ActivatedRoute,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit(): void {
    this.onLoad(false);
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((_) => {
      this.onLoad(false);
    });
  }

  onLoadMore() {
    this.onLoad(true);
  }

  onLoad(isPaginate: boolean) {
    const val = this.formGroup.value;
    this.systemHistoryStore.update((state) => ({
      ...state,
      search: val,
    }));
    this.actions$.dispatch(
      SystemHistoryActions.loadAll({
        search: val,
        isSet: isPaginate,
      })
    );
  }
}
