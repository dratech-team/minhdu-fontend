import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
  @Input() data: any;
  @Input() formGroup!: UntypedFormGroup;
  @Input() pickPOne: boolean | undefined;

  account$ = this.accountQuery.selectCurrentUser();
  loading$ = this.commodityQuery.selectLoading();
  remain$ = this.commodityQuery.select(state => state.remain);
  total$ = this.commodityQuery.selectCount();
  commodities$ = this.commodityQuery.selectAll();

  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly CommodityEntity[] = [];
  indeterminate = false;
  checked = false;

  CommodityUnit = CommodityUnit;
  CustomerType = CustomerType;
  ModeEnum = ModeEnum;

  formGroupCommodity = new UntypedFormGroup({
    code: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    unit: new UntypedFormControl('')
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
    this.formGroup.get('commodityIds')?.value?.forEach((id: number) => {
      this.setOfCheckedId.add(id);
    });
    this.actions$.dispatch(
      CommodityAction.loadAll({ search: {} })
    );
    this.formGroupCommodity.valueChanges
      .pipe(debounceTime(2000))
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
    });
  }


  onUpdate(commodity: CommodityEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật hàngh hoá',
      nzContent: CommodityDialogComponent,
      nzComponentParams: {
        data: { commodity, isUpdate: true }
      },
      nzFooter: null
    });
  }

  onRemove($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CommodityAction.remove({ id: $event.id }));
      }
    });
  }

  public onLoadMore() {
    const val = this.formGroupCommodity.value;
    this.actions$.dispatch(
      CommodityAction.loadAll({
        search: this.mapToCommodity(val),
        isPaginate: true
      })
    );
  }

  public closeDialog() {
    this.actions$.dispatch(CommodityAction.resetStateCommodityNewAdd());
    this.modalRef.close(this.setOfCheckedId);
  }

  public onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) =>
      this.updateCheckedSet(id, checked)
    );
    this.refreshCheckedStatus();
    this.formGroup
      .get('commodityIds')
      ?.setValue(Array.from(this.setOfCheckedId));
  }

  public updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.formGroup
      .get('commodityIds')
      ?.setValue(Array.from(this.setOfCheckedId));
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
    this.formGroup
      .get('commodityIds')
      ?.setValue(Array.from(this.setOfCheckedId));
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
