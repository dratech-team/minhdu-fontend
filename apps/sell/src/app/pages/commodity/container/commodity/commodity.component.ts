import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectAllCommodity } from '../+state/commodity.selector';
import { CommodityAction } from '../+state/commodity.action';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'commodity.component.html'
})
export class CommodityComponent implements OnInit {
  // commodity$ = this.store.pipe(select(selectAllCommodity))
  commodityUnit = CommodityUnit;
  commodities =[
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.KG,
    },
    {
      id: 1,
      code: 'sp1',
      name:'gà 1',
      price: 10000,
      amount: 10000,
      unit: CommodityUnit.CON,
    }
  ]

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    // this.store.dispatch(CommodityAction.loadInit({take: 30, skip: 0}))
  }
  add(){
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
    })
  }
  onScroll(){

  }
  deleteCommodity($event: any){

  }
  detailCommodity(){
    this.router.navigate(['commodity/detail-commodity'] ).then()
  }

}
