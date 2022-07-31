import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SettingRankQuery } from '../../state/setting-rank/setting-rank.query';
import { SettingRankStore } from '../../state/setting-rank/setting-rank.store';
import { Actions } from '@datorama/akita-ng-effects';
import { SettingRankActions } from '../../state/setting-rank/setting-rank.action';
import { SettingRankEntity } from '../../entities/setting-rank.entity';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: 'setting-rank.component.html',
})
export class SettingRankComponent implements OnInit {
  settingRanks$ = this.settingRankQuery.selectAll();
  loading$ = this.settingRankQuery.select((state) => state.loading);
  loadMore$ = this.settingRankQuery.select((state) => state.loadMore);
  total$ = this.settingRankQuery.select((state) => state.total);
  added$ = this.settingRankQuery
    .select((state) => state.added)
    .pipe(
      tap((val) => {
        if (val) {
          this.updateSettingRank = undefined;
        }
      })
    );
  count$ = this.settingRankQuery.selectCount();

  updateSettingRank?: SettingRankEntity;

  formGroup = new UntypedFormGroup({
    from: new UntypedFormControl(''),
    to: new UntypedFormControl(''),
    rank: new UntypedFormControl(''),
  });

  constructor(
    private readonly router: Router,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly actions$: Actions,
    private readonly settingRankQuery: SettingRankQuery,
    private readonly settingRankStore: SettingRankStore
  ) {}

  ngOnInit() {
    this.onload(false);
    this.formGroup
      .get('rank')
      ?.valueChanges.subscribe((val) =>
        this.formGroup
          .get('rank')
          ?.setValue(val.toUpperCase(), { emitEvent: false })
      );
  }

  onLoadMore() {
    this.onload(true);
  }

  onload(isPaginate: boolean) {
    this.settingRankStore.update((state) => ({
      ...state,
      search: this.formGroup.value,
    }));
    this.actions$.dispatch(
      SettingRankActions.loadAll({
        search: this.formGroup.value,
        isSet: isPaginate,
      })
    );
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    this.actions$.dispatch(
      this.updateSettingRank
        ? SettingRankActions.update({
            id: this.updateSettingRank?.id,
            updates: this.formGroup.value,
          })
        : SettingRankActions.addOne({
            body: this.formGroup.value,
          })
    );
  }

  onCancel() {
    this.router.navigate(['xep-hang']).then();
  }

  onUpdate(settingRank: SettingRankEntity) {
    this.formGroup = this.formBuilder.group({
      from: [settingRank.from],
      to: [settingRank.to],
      rank: [settingRank.rank],
    });
    this.updateSettingRank = settingRank;
  }
}
