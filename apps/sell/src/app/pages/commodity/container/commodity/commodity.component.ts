import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectAllCommodity } from '../+state/commodity.selector';
import { CommodityAction, loadMoreCommodity } from '../+state/commodity.action';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { CustomerAction } from '../../../customer/+state/customer.action';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  templateUrl: 'commodity.component.html'
})
export class CommodityComponent implements OnInit {
  commodity$ = this.store.pipe(select(selectAllCommodity))
  commodityUnit = CommodityUnit;
  pageIndex: number = 1;
  pageSize: number = 30;
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      code: new FormControl(''),
      unit: new FormControl(''),
    }
  );
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    this.store.dispatch(CommodityAction.loadInit({take: 30, skip: 0}))
  }
  add(){
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
    })
  }
  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(CommodityAction.loadMoreCommodity(this.commodity(val, this.pageSize, this.pageIndex)));
  }
  deleteCommodity(id: number){
    const dialogRef = this.dialog.open(DialogDeleteComponent, {width: '25%'})
    dialogRef.afterClosed().subscribe(val=> {
      if(val){
        this.store.dispatch(CommodityAction.deleteCommodity({id: id}))
      }
    })
  }
  commodity(val: any , pageSize: number, pageIndex: number) {
    return {
      skip: pageSize * pageIndex++,
      take: this.pageSize,
    };
  }
  // detailCommodity($event: any){
  //   console.log($event.id)
  //   this.router.navigate(['commodity/detail-commodity', $event.id] ).then()
  // }
}
