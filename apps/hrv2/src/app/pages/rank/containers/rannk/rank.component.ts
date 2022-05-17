import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {Branch, Position} from "@minhdu-fontend/data-models";
import {AppStore} from "../../../../state/app.store";
import {Router} from "@angular/router";
import {RankStore} from "../../state/rank/rank.store";
import {RankQuery} from "../../state/rank/rank.query";
import {Actions} from "@datorama/akita-ng-effects";
import {RankActions} from "../../state/rank/rank.action";

@Component({
  selector: 'minhdu-fontend-rank',
  templateUrl: 'rank.component.html'
})
export class RankComponent implements OnInit {
  ranks$ = this.rankQuery.selectAll()
  loading$ = this.rankQuery.select(state => state.loading)
  loadMore$ = this.rankQuery.select(state => state.loadMore)
  total$ = this.rankQuery.select(state => state.total)
  count$ = this.rankQuery.selectCount()
  positions$ = new Observable<Position[]>()
  branches$ = new Observable<Branch[]>()

  formGroup = new FormGroup({
    search: new FormControl(''),
    name: new FormControl(''),
    gender: new FormControl(''),
    position: new FormControl([]),
    branch: new FormControl('')
  });

  constructor(
    private readonly appStore: AppStore,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly rankStore: RankStore,
    private readonly rankQuery: RankQuery,
  ) {
  }

  ngOnInit() {
    this.onLoad(false)
    this.formGroup.valueChanges.subscribe(_ => {
      this.onLoad(false)
    })
  }

  onLoadMore() {
    this.onLoad(true)
  }

  onLoad(isPaginate: boolean) {
    this.rankStore.update(state => ({
      ...state, search: this.formGroup.value
    }))
    this.actions$.dispatch(RankActions.loadAll({
      search: this.formGroup.value,
      isPaginate: isPaginate
    }))
  }

  onSetting(type: 'BONUS' | 'RANK') {
    this.appStore.update(state => ({
      ...state, appName: type === 'BONUS' ? 'Cài đặt thưởng' : 'Cài đặt Xếp hạng'
    }))
    this.router.navigate(['xep-hang/' + (type === 'BONUS' ? 'cai-dat-thuong' : 'cai-dat-xep-hang')]).then()
  }
}
