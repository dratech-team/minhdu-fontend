import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormControl, FormGroup} from '@angular/forms';
import {ProvinceAction, selectAllProvince} from "@minhdu-fontend/location";
import {
  getFirstDayInMonth,
  getLastDayInMonth,
  searchAndAddAutocomplete,
  searchAutocomplete
} from "@minhdu-fontend/utils";
import {debounceTime, map, startWith} from "rxjs/operators";
import {of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AddEggComponent} from "../components/dialog-add-egg/add-egg.component";
import {IncubatorFactoryService} from "../services/incubator-factory.service";
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IncubatorFactoryQuery} from "../state/incubator-factory.query";
import {EggTypeQuery} from "../../egg-type/state/egg-type.query";
import {Actions} from "@datorama/akita-ng-effects";
import {EggTypeActions} from "../../egg-type/state/egg-type.action";
import {Branch} from "@minhdu-fontend/data-models";
import {getAllOrgchart, OrgchartActions} from "@minhdu-fontend/orgchart";
import {IncubatorFactoryActions} from "../state/incubator-factory.action";
import {EggTypeEntity} from "../../egg-type/entities/egg-type.entity";
import {Egg, IncubatorFactoryEntity} from "../entities/incubator-factory.entity";

@Component({
  templateUrl: 'incubator-factory.component.html'
})
export class IncubatorFactoryComponent implements OnInit {
  branches$ = this.storeNgrx.pipe(select(getAllOrgchart));
  eggTypes$ = this.eggTypeQuery.selectAll()
  eggData$ = this.incubatorService.pagination({
    take: 30,
    skip: 0,
    startedAt: getFirstDayInMonth(new Date()),
    endedAt: getLastDayInMonth(new Date())
  }).pipe(map((e) => e))

  pageSize = 30
  pageIndex = 0
  branchSelected?: Branch;
  formGroup = new FormGroup({
    branches: new FormControl(''),
    startedAt: new FormControl(this.datePipe.transform(getFirstDayInMonth(new Date()), 'yyyy-MM-dd')),
    endedAt: new FormControl(this.datePipe.transform(getLastDayInMonth(new Date()), 'yyyy-MM-dd')),
  });

  constructor(
    private readonly storeNgrx: Store,
    private readonly datePipe: DatePipe,
    private readonly incubatorService: IncubatorFactoryService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly incubatorFactoryQuery: IncubatorFactoryQuery,
    private readonly eggTypeQuery: EggTypeQuery,
    private readonly action$: Actions
  ) {
  }


  ngOnInit() {
    this.storeNgrx.dispatch(OrgchartActions.init());

    this.branches$.subscribe(val=> console.log(val))
    this.action$.dispatch(EggTypeActions.loadAll())

    this.branches$ = searchAndAddAutocomplete(
      this.formGroup.get('branches')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(val => {
      if (  !val.endedAt) {
        this.snackbar.open('chưa chọn ngày kết thúc', '', {duration: 1500})
      } else {
        const param = {
          take: this.pageSize,
          skip: this.pageIndex,
          startedAt: new Date(val.startedAt),
          endedAt: new Date(val.endedAt),
          branchId: this.branchSelected?.id
        }
        if(!val.branches){
          this.branchSelected = undefined
          delete param.branchId
        }
        this.action$.dispatch(IncubatorFactoryActions.loadAll(param))
      }
    })
  }


  onSelectBranch(event: any, branch: Branch) {
    if (event.isUserInput) {
        this.branchSelected = branch;
    }
  }

  onScroll() {
    const value = this.formGroup.value
    this.incubatorService.pagination({
        take: this.pageSize,
        skip: this.incubatorFactoryQuery.getCount(),
        branchId: value.branchId ? value.branchId : '',
        startedAt: new Date(value.startedAt),
        endedAt: new Date(value.endedAt)
      }
    )
  }

  addEgg() {
    this.dialog.open(AddEggComponent, {width: 'fit-content', data: {branch: this.branchSelected}})
  }

  checkEgg(eggTypes:(EggTypeEntity|undefined)[],egg:Egg): boolean {
      return  !eggTypes.some(e => e?.id == egg.type.id)
  }
}
