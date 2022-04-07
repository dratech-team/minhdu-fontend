import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {ConsignmentActions} from '../../state/consignment.actions';
import {ConsignmentQuery} from '../../state/consignment.query';
import {Actions} from '@datorama/akita-ng-effects';
import {FormControl, FormGroup} from "@angular/forms";
import {PaginationDto} from "@minhdu-fontend/constants";
import {ProductActions} from "../../../product/state/product.actions";

@Component({
  selector: 'minhdu-fontend-consignment',
  templateUrl: 'consignment.component.html'
})
export class ConsignmentComponent implements OnInit {
  formGroup = new FormGroup({
    code: new FormControl(''),
    mfg: new FormControl(''),
    exp: new FormControl(''),
  })
  consignments$ = this.consignmentQuery.selectAll()
  loading$ = this.consignmentQuery.selectLoading();
  pageSize = 10;
  constructor(
    private readonly consignmentQuery: ConsignmentQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(ConsignmentActions.loadAll({}));
  }

  onDelete($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(ConsignmentActions.remove({id: $event.id}));
      }
    });
  }

  onPagination(index: number){
    const count = this.consignmentQuery.getCount();
    if (index * this.pageSize >= count) {
      this.actions$.dispatch(ProductActions.loadAll({
        search: this.mapConsignment( true),
        isPaginate: true
      }));
    }
  }

  onUpdate($event: any) {
  }

  mapConsignment(isPagination?: boolean){
   return  Object.assign({},this.formGroup.value, {
      take: PaginationDto.take,
      skip: isPagination ? this.consignmentQuery.getCount() : PaginationDto.skip
    });
  }
}
