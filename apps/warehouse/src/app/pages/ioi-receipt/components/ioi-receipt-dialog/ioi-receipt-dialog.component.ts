import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {Actions} from '@datorama/akita-ng-effects';
import {SupplierActions} from '../../../supplier/state';
import {IoiReceiptActions} from '../../state/ioi-receipt.actions';
import {ProductActions} from "../../../product/state/product.actions";
import {ProductQuery} from "../../../product/state/product.query";
import {IoiReceiptEntity} from "../../entities";
import {BaseUpdateIoiReceiptDto} from "../../dto";
import {DiscountTypeConstant} from "../../constants";
import {DiscountTypeEnum, IoiReceiptEnum} from "../../../../../shared/enums";
import {PaginationDto} from "@minhdu-fontend/constants";
import {BranchActions, BranchQuery} from "@minhdu-fontend/orgchart-v2";

@Component({
  templateUrl: 'ioi-receipt-dialog.component.html'
})
export class IoiReceiptDialogComponent implements OnInit {
  @Input() data!: { ioiReceipt?: IoiReceiptEntity, isUpdate?: boolean, ioiReceiptType: IoiReceiptEnum }
  branches$ = this.branchQuery.selectAll();
  products$ = this.productQuery.selectAll();
  loadingProduct$ = this.productQuery.select(state => state.loading)
  formGroup!: UntypedFormGroup
  discountTypeConstant = DiscountTypeConstant
  pageSizeTable = 5

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private readonly productQuery: ProductQuery,
    private readonly actions$: Actions,
    private readonly branchQuery: BranchQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}));
    this.actions$.dispatch(SupplierActions.loadAll({}));
    this.actions$.dispatch(ProductActions.loadAll({}))
    if (this.data?.ioiReceipt) {
      this.formGroup = this.formBuilder.group({
        accountedAt: [this.datePipe.transform(
          this.data.ioiReceipt.accountedAt, 'yyyy-MM-dd'
        ), Validators.required],
        billedAt: [this.datePipe.transform(
          this.data.ioiReceipt.billedAt, 'yyyy-MM-dd'
        ), Validators.required],
        billCode: [this.data.ioiReceipt.billCode, Validators.required],
        discount: [this.data.ioiReceipt?.discount && this.data.ioiReceipt?.discountType ?
          (this.data.ioiReceipt.discountType === DiscountTypeEnum.PERCENT ? this.data.ioiReceipt.discount * 100 :
            this.data.ioiReceipt.discountType === DiscountTypeEnum.CASH ? this.data.ioiReceipt.discount :
              this.data.ioiReceipt.discount)
          : undefined],
        discountType: [this.data.ioiReceipt?.discountType],
        orderedAt: [this.datePipe.transform(
          this.data.ioiReceipt.orderedAt, 'yyyy-MM-dd'
        ), Validators.required],
        importedAt: [this.datePipe.transform(
          this.data.ioiReceipt.importedAt, 'yyyy-MM-dd'
        ), Validators.required],
        completedAt: [this.datePipe.transform(
          this.data.ioiReceipt.completedAt, 'yyyy-MM-dd'
        ), Validators.required],
        approvedAt: [this.datePipe.transform(
          this.data.ioiReceipt.approvedAt, 'yyyy-MM-dd'
        ), Validators.required],
        note: [this.data.ioiReceipt?.note],
        attachment: [this.data.ioiReceipt?.attachment?.file],
        product: [this.data.ioiReceipt.product, Validators.required],
        consignment: [this.data.ioiReceipt?.consignment],
        branch: [this.data.ioiReceipt.branch, Validators.required],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        type: ['', Validators.required],
        accountedAt: ['', Validators.required],
        billedAt: ['', Validators.required],
        billCode: ['', Validators.required],
        discount: [''],
        discountType: [DiscountTypeEnum.PERCENT],
        orderedAt: ['', Validators.required],
        importedAt: ['', Validators.required],
        completedAt: ['', Validators.required],
        approvedAt: ['', Validators.required],
        note: [''],
        attachment: [''],
        product: ['', Validators.required],
        consignment: [],
        branch: ['', Validators.required],
      });
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const stockUpdate: BaseUpdateIoiReceiptDto = {
      type: this.data.ioiReceiptType,
      note: value?.note,
      approvedAt: value.approvedAt,
      completedAt: value.completedAt,
      importedAt: value.importedAt,
      orderedAt: value.orderedAt,
      discount: value.discountType / 100,
      discountType: value.discountType,
      billCode: value.billCode,
      billedAt: value.billedAt,
      accountedAt: value.accountedAt,
      consignmentId: value.consignment.id,
      attachment: value.attachment,
      branchId: value.branch.id,
      products: value.product
    }
    if (this.data?.isUpdate && this.data.ioiReceipt) {
      this.actions$.dispatch(IoiReceiptActions.update({id: this.data.ioiReceipt.id, updates: stockUpdate}));
    } else {
      this.actions$.dispatch(IoiReceiptActions.addOne({body: value}));
    }
  }

  onChangePageProduct(index: number) {
    const count = this.productQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(ProductActions.loadAll({
        search: {take: PaginationDto.take, skip: count},
        isPaginate: true
      }));
    }
  }
}


