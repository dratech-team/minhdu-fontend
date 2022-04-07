import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {ConsignmentActions} from '../../state/consignment.actions';
import {ConsignmentQuery} from '../../state/consignment.query';
import {Actions} from '@datorama/akita-ng-effects';
import {FormControl, FormGroup} from "@angular/forms";
import {PaginationDto} from "@minhdu-fontend/constants";
import {ProductActions} from "../../../product/state/product.actions";
import {ConsignmentEntity} from "../../entities";
import {debounceTime, map} from "rxjs/operators";
import {NzModalService} from "ng-zorro-antd/modal";
import {ConsignmentDialogComponent} from "../../components/consignment-dialog/consignment-dialog.component";
import {EntityActions} from "@datorama/akita";
import {CommodityEntity} from "../../../../../../../sell/src/app/pages/commodity/entities";
import {ConsignmentStore} from "../../state/consignment.store";

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
  consignments$ = this.consignmentQuery.selectAll().pipe(map(consignments => {
    this.currentPageData = JSON.parse(JSON.stringify(consignments))
    return JSON.parse(JSON.stringify(consignments))
  }))
  loading$ = this.consignmentQuery.selectLoading();
  pageSize = 10;
  idsSelected = new Set<number>();
  checked = false;
  indeterminate = false;
  currentPageData: readonly CommodityEntity[] = [];

  constructor(
    private readonly consignmentQuery: ConsignmentQuery,
    private readonly consignmentStore: ConsignmentStore,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(ConsignmentActions.loadAll({}));
  }

  onAdd(consignment?: ConsignmentEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Tạo lô hàng',
      nzContent: ConsignmentDialogComponent,
      nzComponentParams: {
        data: {consignment}
      },
      nzFooter: null
    })
  }

  onDelete($event: any) {
    this.consignmentQuery.selectEntityAction(EntityActions.Add).subscribe(val => {
      if (val.length === 1)
        this.idsSelected.add(val[0].id)
    })
    const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(ConsignmentActions.remove({id: $event.id}));
      }
    });
  }

  onPagination(index: number) {
    const count = this.consignmentQuery.getCount();
    if (index * this.pageSize >= count) {
      this.actions$.dispatch(ProductActions.loadAll({
        search: this.mapConsignment(true),
        isPaginate: true
      }));
    }
  }

  onUpdate($event: any) {
  }

  mapConsignment(isPagination?: boolean) {
    return Object.assign({}, this.formGroup.value, {
      take: PaginationDto.take,
      skip: isPagination ? this.consignmentQuery.getCount() : PaginationDto.skip
    });
  }

  onUpdateAmount(amount: number, consignment: ConsignmentEntity) {
    this.consignmentStore.update(consignment.id, Object.assign(consignment, {amount:amount}))
  }

  onAllChecked(checked: boolean): void {
    this.currentPageData.forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.formGroup.get('commodityIds')?.setValue(Array.from(this.idsSelected));
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.idsSelected.add(id);
    } else {
      this.idsSelected.delete(id);
    }
    this.formGroup.get('commodityIds')?.setValue(Array.from(this.idsSelected));
  }

  refreshCheckedStatus(): void {
    this.checked = this.currentPageData.every(({id}) => this.idsSelected.has(id));
    this.indeterminate = this.currentPageData.some(({id}) => this.idsSelected.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.formGroup.get('commodityIds')?.setValue(Array.from(this.idsSelected));
  }
}
