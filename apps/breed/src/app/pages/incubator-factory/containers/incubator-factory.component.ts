import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  getFirstDayInMonth,
  getLastDayInMonth,
  searchAndAddAutocomplete,
} from '@minhdu-fontend/utils';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddEggComponent } from '../components/dialog-add-egg/add-egg.component';
import { IncubatorFactoryService } from '../services/incubator-factory.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IncubatorFactoryQuery } from '../state/incubator-factory.query';
import { EggTypeQuery } from '../../egg-type/state/egg-type.query';
import { Actions } from '@datorama/akita-ng-effects';
import { EggTypeActions } from '../../egg-type/state/egg-type.action';
import { Branch } from '@minhdu-fontend/data-models';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { IncubatorFactoryActions } from '../state/incubator-factory.action';
import { EggTypeEntity } from '../../egg-type/entities/egg-type.entity';
import { PaginationDto } from '@minhdu-fontend/constants';
import { IncubatorFactoryStore } from '../state/incubator-factory.store';

@Component({
  templateUrl: 'incubator-factory.component.html',
})
export class IncubatorFactoryComponent implements OnInit {
  branches$ = this.storeNgrx.pipe(select(getAllOrgchart));
  eggTypes$ = this.eggTypeQuery.selectAll().pipe(
    map((types) =>
      types
        .concat({
          id: -1,
          name: 'Tổng soi loại',
          rated: true,
          stt: 5,
          added: false,
        })
        .sort((a, b) => (a.stt || 0) - (b.stt || 1))
    )
  );
  incubator$ = this.incubatorFactoryQuery.selectAll();

  pageSize = 30;
  pageIndex = 0;

  formGroup = new UntypedFormGroup({
    branches: new UntypedFormControl(''),
    startedAt: new UntypedFormControl(
      this.datePipe.transform(getFirstDayInMonth(new Date()), 'yyyy-MM-dd')
    ),
    endedAt: new UntypedFormControl(
      this.datePipe.transform(getLastDayInMonth(new Date()), 'yyyy-MM-dd')
    ),
  });

  constructor(
    private readonly storeNgrx: Store,
    private readonly datePipe: DatePipe,
    private readonly incubatorService: IncubatorFactoryService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly incubatorFactoryQuery: IncubatorFactoryQuery,
    private readonly eggTypeQuery: EggTypeQuery,
    private readonly action$: Actions,
    private readonly eggStore: IncubatorFactoryStore
  ) {}

  ngOnInit() {
    this.storeNgrx.dispatch(OrgchartActions.init());
    this.action$.dispatch(EggTypeActions.loadAll());
    this.action$.dispatch(
      IncubatorFactoryActions.loadAll({
        take: PaginationDto.take,
        skip: PaginationDto.skip,
        startedAt: getFirstDayInMonth(new Date()),
        endedAt: getLastDayInMonth(new Date()),
      })
    );

    this.branches$ = searchAndAddAutocomplete(
      this.formGroup.get('branches')?.valueChanges.pipe(startWith('')) ||
        of(''),
      this.branches$
    );

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((val) => {
      const param = {
        take: this.pageSize,
        skip: this.pageIndex,
        startedAt: new Date(val.startedAt),
        endedAt: new Date(val.endedAt),
        branchId: this.incubatorFactoryQuery.getValue()?.branchId,
      };
      this.action$.dispatch(IncubatorFactoryActions.loadAll(param));
    });
  }

  onSelectBranch(branch: Branch) {
    if (branch) {
      this.eggStore.update((state) => ({ ...state, branchId: branch.id }));
    }
  }

  onScroll() {
    const value = this.formGroup.value;
    this.incubatorService.pagination({
      take: this.pageSize,
      skip: this.incubatorFactoryQuery.getCount(),
      branchId: value.branchId ? value.branchId : '',
      startedAt: new Date(value.startedAt),
      endedAt: new Date(value.endedAt),
    });
  }

  addEgg() {
    this.dialog.open(AddEggComponent, {
      width: 'fit-content',
    });
  }

  checkEgg(eggTypes: (EggTypeEntity | undefined)[], egg: any): boolean {
    return !eggTypes.some((e) => e?.id == egg.type.id);
  }
}
