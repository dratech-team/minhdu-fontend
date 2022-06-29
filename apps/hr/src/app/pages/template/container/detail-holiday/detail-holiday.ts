import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { HolidayAction } from '../../+state/holiday/holiday.action';
import {
  getHolidayById,
  selectBranchHoliday,
  selectHolidayLoaded,
  selectPositionHoliday,
} from '../../+state/holiday/holiday.selector';
import { getSelectors } from '../../../../../../../../libs/utils/getState.ultils';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  getAllPosition,
  PositionActions,
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { SearchTypeConstant } from '@minhdu-fontend/constants';
import { SearchTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DialogHolidayComponent } from '../../component/dialog-holiday/dialog-holiday.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: 'detail-holiday.html',
})
export class DetailHoliday implements OnInit {
  searchTypeConstant = SearchTypeConstant;
  holiday$ = this.store.select(getHolidayById(this.holidayId));
  positions$ = this.store.pipe(select(getAllPosition));
  loaded$ = this.store.pipe(select(selectHolidayLoaded));
  branches$ = this.store.pipe(select(getAllOrgchart));
  fCtrlPosition = new UntypedFormControl(
    getSelectors(selectPositionHoliday, this.store)
  );
  fCtrlBranch = new UntypedFormControl('');
  formGroup = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    code: new UntypedFormControl(''),
    position: new UntypedFormControl(
      getSelectors(selectPositionHoliday, this.store)
    ),
    branch: new UntypedFormControl(''),
    isConstraint: new UntypedFormControl(''),
  });

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.store.dispatch(
      HolidayAction.getHoliday({
        id: this.holidayId,
        params: { position: getSelectors(selectPositionHoliday, this.store) },
      })
    );

    this.fCtrlPosition.valueChanges.subscribe((val) => {
      if (!val) {
        this.formGroup.get('position')?.patchValue('');
      }
    });

    this.fCtrlBranch.valueChanges.subscribe((val) => {
      if (!val) {
        this.formGroup.get('branch')?.patchValue('');
      }
    });
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            HolidayAction.updateStateHoliday({
              position: val.position,
              branch: val.branch,
            })
          );
          this.store.dispatch(
            HolidayAction.getHoliday({
              id: this.holidayId,
              params: {
                position: val.position,
                branch: val.branch,
                code: val.code,
                name: val.name,
              },
            })
          );
        })
      )
      .subscribe();

    this.positions$ = searchAutocomplete(
      this.fCtrlPosition.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.fCtrlBranch.valueChanges.pipe(startWith('')),
      this.branches$
    );
  }

  get holidayId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }

  detailPayroll(id: number) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', id]).then();
  }

  updateHoliday(item: any) {
    const dialogRef = this.dialog.open(DialogHolidayComponent, {
      width: '35%',
      data: { holiday: item, updateDetail: true, isUpdate: true },
      panelClass: 'ccc',
      backdropClass: 'ggg',
    });
  }
}
