import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommodityUnit, CustomerType, ModeEnum } from '@minhdu-fontend/enums';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { debounceTime } from 'rxjs/operators';
import { CommodityAction, CommodityQuery } from '../../../pages/commodity/state';
import { CommodityDialogComponent } from '../../../pages/commodity/component';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityEntity } from '../../../pages/commodity/entities';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AccountQuery } from '../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  selector: 'select-commodity',
  templateUrl: 'select-commodity.component.html'
})
export class SelectCommodityComponent implements OnInit {
  @Input() commodities?: CommodityEntity[];

  account$ = this.accountQuery.selectCurrentUser();
  loading$ = this.commodityQuery.selectLoading();
  remain$ = this.commodityQuery.select(state => state.remain);
  total$ = this.commodityQuery.selectCount();
  commodities$ = this.commodityQuery.selectAll();

  setOfCheckedId = new Set<number>;
  listOfCurrentPageData: readonly CommodityEntity[] = [];
  indeterminate = false;
  checked = false;

  CommodityUnit = CommodityUnit;
  CustomerType = CustomerType;
  ModeEnum = ModeEnum;

  formGroup = new FormGroup({
    code: new FormControl<string>(''),
    name: new FormControl<string>(''),
    unit: new FormControl<CommodityUnit>(CommodityUnit.CON)
  });

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly modalRef: NzModalRef,
    private readonly commodityQuery: CommodityQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(
      CommodityAction.loadAll({ search: {} })
    );
    this.formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((val) => {
        this.actions$.dispatch(
          CommodityAction.loadAll({ search: this.mapToCommodity(val) })
        );
      });
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'Thêm hàng hoá',
      nzContent: CommodityDialogComponent,
      nzFooter: []
    }).afterClose.subscribe(() => {
      this.updateCheckedSet(this.commodityQuery.getActiveId(), true);
    });
  }

  onUpdate(commodity: CommodityEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật hàng hoá',
      nzContent: CommodityDialogComponent,
      nzComponentParams: {
        data: { commodity, isUpdate: true }
      },
      nzFooter: null
    });
  }

  onRemove($event: any) {
    this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    }).afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CommodityAction.remove({ id: $event.id }));
      }
    });
  }

  public onLoadMore() {
    const value = this.formGroup.value;
    this.actions$.dispatch(
      CommodityAction.loadAll({
        search: this.mapToCommodity(value),
        isPaginate: true
      })
    );
  }

  public closeDialog() {
    this.modalRef.close(Array.from(this.setOfCheckedId));
  }

  public onSetAll(checked: boolean): void {
    this.commodityQuery.getAll().forEach(({ id }) =>
      this.updateCheckedSet(id, checked)
    );
    this.refreshCheckedStatus();
  }

  public updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  public refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(({ id }) =>
      this.setOfCheckedId.has(id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some(({ id }) =>
        this.setOfCheckedId.has(id)
      ) && !this.checked;
  }

  public onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  public onCurrentPageDataChange(
    listOfCurrentPageData: readonly CommodityEntity[]
  ): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  private mapToCommodity(val: any) {
    return {
      name: val.name,
      code: val.code,
      unit: val.unit
    };
  }
}
