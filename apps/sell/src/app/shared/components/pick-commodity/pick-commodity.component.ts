import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {CommodityUnit, CustomerType} from '@minhdu-fontend/enums';
import {DialogDeleteComponent} from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import {debounceTime} from 'rxjs/operators';
import {CommodityAction} from '../../../pages/commodity/+state/commodity.action';
import {CommodityDialogComponent} from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';
import {CommodityQuery} from '../../../pages/commodity/+state/commodity.query';
import {Actions} from '@datorama/akita-ng-effects';
import {CommodityEntity} from "../../../pages/commodity/entities/commodity.entity";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-pick-commodity',
  templateUrl: 'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit {
  @Input() data: any
  @Input() pickPOne: boolean | undefined;
  setOfCheckedId = new Set<number>();
  commodityUnit = CommodityUnit;
  customerType = CustomerType;
  pageIndex = 0;
  pageSize = 14;
  formGroup!: FormGroup
  commodities$ = this.commodityQuery.selectAll();
  total$ = this.commodityQuery.selectCount();
  formGroupCommodity = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
    unit: new FormControl('')
  });
  indeterminate = false;
  listOfCurrentPageData: readonly CommodityEntity[] = [];

  checked = false;
  pageSizeTable = 7;

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private modalRef: NzModalRef,
    private controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = <FormGroup>this.controlContainer.control;
    this.formGroup.get('commodityIds')?.value.forEach((id:number) => {
      this.setOfCheckedId.add(id)
    })
    this.actions$.dispatch(
      CommodityAction.loadAll({params: {take: this.pageSize, skip: this.pageIndex}})
    );
    this.formGroupCommodity.valueChanges.pipe(debounceTime(2000)).subscribe((val) => {
      this.actions$.dispatch(
        CommodityAction.loadAll({params: this.commodity(val)})
      );
    });
  }

  commodity(val: any, isScroll?: boolean) {
    return {
      take: this.pageSize,
      skip: isScroll ? this.commodityQuery.getCount() : this.pageIndex,
      name: val.name,
      code: val.code,
      unit: val.unit
    };
  }

  addCommodity() {
    this.modal.create({
      nzTitle: 'Thêm hàngh hoá',
      nzContent: CommodityDialogComponent,
      nzFooter: null,
    }).afterClose.subscribe((value => {
    }))
  }

  deleteCommodity($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CommodityAction.remove({id: $event.id}));
      }
    });
  }

  updateCommodity(commodity: CommodityEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật hàngh hoá',
      nzContent: CommodityDialogComponent,
      nzComponentParams: {
        data: {commodity, isUpdate: true}
      },
      nzFooter: null,
    })
  }

  onPagination(index: number) {
    const count = this.commodityQuery.getCount()
    if (index * this.pageSizeTable >= count) {
      const val = this.formGroupCommodity.value;
      this.actions$.dispatch(
        CommodityAction.loadAll({params: this.commodity(val, true), isPagination: true})
      );
    }
  }

  closeDialog() {
    this.actions$.dispatch(CommodityAction.resetStateCommodityNewAdd());
    this.modalRef.close(this.setOfCheckedId);
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.formGroup.get('commodityIds')?.setValue(Array.from(this.setOfCheckedId))
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.formGroup.get('commodityIds')?.setValue(Array.from(this.setOfCheckedId))
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(({id}) => this.setOfCheckedId.has(id));
    this.indeterminate = this.listOfCurrentPageData.some(({id}) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.formGroup.get('commodityIds')?.setValue(Array.from(this.setOfCheckedId))
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly CommodityEntity[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }
}
