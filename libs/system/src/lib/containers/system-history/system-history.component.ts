import {Component, OnInit} from '@angular/core';
import {App, ModeEnum} from '@minhdu-fontend/enums';
import {FormControl, FormGroup} from '@angular/forms';
import {appConstant, MethodConstant} from '@minhdu-fontend/constants';
import {Actions} from "@datorama/akita-ng-effects";
import {SystemHistoryQuery} from "../../state/system-history/system-history.query";
import {SystemHistoryActions} from "../../state/system-history/system-history.actions";
import {SystemHistoryStore} from "../../state/system-history/system-history.store";
import {debounceTime} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {AccountQuery} from "../../state/account-management/account.query";

@Component({
  templateUrl: 'system-history.component.html',
})
export class systemHistoryComponent implements OnInit {
  systemHistory$ = this.systemHistoryQuery.selectAll()
  loading$ = this.systemHistoryQuery.select(state => state.loading)
  loadMore$ = this.systemHistoryQuery.select(state => state.loadMore)
  total$ = this.systemHistoryQuery.select(state => state.total);
  remain$ = this.systemHistoryQuery.select(state => state.remain);
  count$ = this.systemHistoryQuery.selectCount()
  currentUser$ = this.accountQuery.select(state => state.currentUser)

  app = App;
  apps = appConstant;
  methods = MethodConstant;
  pageSize = 30;
  pageIndexInit = 0;
  modeEnum = ModeEnum

  stateSearch = this.systemHistoryQuery.getValue().search
  formGroup = new FormGroup({
    search: new FormControl(this.stateSearch?.search || ''),
    id: new FormControl(this.stateSearch?.id || ''),
    appName: new FormControl(this.stateSearch?.appName || ''),
    name: new FormControl(this.stateSearch?.name || ''),
    activity: new FormControl(this.stateSearch?.activity || ''),
    description: new FormControl(this.stateSearch?.description || ''),
    ip: new FormControl(this.stateSearch?.ip || ''),
    createdAt: new FormControl(this.stateSearch?.createdAt || ''),
  });
  pageSizeTable = 15
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.value == o2.value : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly systemHistoryQuery: SystemHistoryQuery,
    private readonly systemHistoryStore: SystemHistoryStore,
    private readonly activeRouter: ActivatedRoute,
    private readonly accountQuery: AccountQuery,
  ) {
  }


  ngOnInit(): void {
    this.onLoad(false)
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(_ => {
      this.onLoad(false)
    })
  }

  onLoadMore() {
    this.onLoad(true)
  }

  onLoad(isPaginate: boolean) {
    const val = this.formGroup.value
    this.systemHistoryStore.update(state => ({
      ...state, search: val
    }))
    this.actions$.dispatch(SystemHistoryActions.loadAll({
      search: val,
      isPaginate
    }))
  }
}
