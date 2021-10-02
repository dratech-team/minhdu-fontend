import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { OrgchartEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import {
  getAllPosition,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';

@Component({
  templateUrl: 'position.container.html'

})
export class PositionContainer implements OnInit {
  positions$ = this.store.pipe(select(getAllPosition));
  type = OrgchartEnum;
  pageSize = 30;
  pageIndexInit = 0;
  positions = new FormControl();

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(PositionActions.loadPosition());
    this.positions.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
      this.store.dispatch(PositionActions.searchPosition({position: val}));
    });
  }

  addPosition() {

  }

  updatePosition($event: any) {

  }

  deletePosition($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {width:'30%'})
    ref.afterClosed().subscribe(val =>{
      if(val){
        this.store.dispatch(PositionActions.deletePosition({id: $event.id}))
      }
    })
  }
}
