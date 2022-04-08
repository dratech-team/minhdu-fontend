import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {Actions} from '@datorama/akita-ng-effects';
import {AppState} from '../../../../reducers';
import {SupplierActions} from '../../../supplier/state';
import {StockActions} from '../../state/stock.actions';
import {ProductActions} from "../../../product/state/product.actions";
import {ProductQuery} from "../../../product/state/product.query";
import {StockEntity} from "../../entities";
import {BaseUpdateStockDto} from "../../dto";
import {DiscountTypeConstant} from "../../constants";
import {DiscountTypeEnum, StockEnum} from "../../../../../shared/enums";
import {PaginationDto} from "@minhdu-fontend/constants";

@Component({
  templateUrl: 'stock-dialog.component.html'
})
export class StockDialogComponent implements OnInit {
  @Input() data!: { stock?: StockEntity, isUpdate?: boolean, stockType: StockEnum }
  branches$ = this.store.select(getAllOrgchart);
  products$ = this.productQuery.selectAll();
  loadingProduct$ = this.productQuery.select(state => state.loading)
  formGroup!: FormGroup
  discountTypeConstant = DiscountTypeConstant
  pageSizeTable = 5
  uiProduct$ =this.productQuery.select(state => state.ui);

  constructor(
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly productQuery: ProductQuery,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.actions$.dispatch(SupplierActions.loadAll({}));
    this.actions$.dispatch(ProductActions.loadAll({}))
    if (this.data?.stock) {
      this.formGroup = this.formBuilder.group({
        accountedAt: [this.datePipe.transform(
          this.data.stock.accountedAt, 'yyyy-MM-dd'
        ), Validators.required],
        billedAt: [this.datePipe.transform(
          this.data.stock.billedAt, 'yyyy-MM-dd'
        ), Validators.required],
        billCode: [this.data.stock.billCode, Validators.required],
        discount: [this.data.stock?.discount && this.data.stock?.discountType ?
          (this.data.stock.discountType === DiscountTypeEnum.PERCENT ? this.data.stock.discount * 100 :
            this.data.stock.discountType === DiscountTypeEnum.CASH ? this.data.stock.discount :
              this.data.stock.discount)
          : undefined],
        discountType: [this.data.stock?.discountType],
        orderedAt: [this.datePipe.transform(
          this.data.stock.orderedAt, 'yyyy-MM-dd'
        ), Validators.required],
        importedAt: [this.datePipe.transform(
          this.data.stock.importedAt, 'yyyy-MM-dd'
        ), Validators.required],
        completedAt: [this.datePipe.transform(
          this.data.stock.completedAt, 'yyyy-MM-dd'
        ), Validators.required],
        approvedAt: [this.datePipe.transform(
          this.data.stock.approvedAt, 'yyyy-MM-dd'
        ), Validators.required],
        note: [this.data.stock?.note],
        attachment: [this.data.stock?.attachment?.file],
        product: [this.data.stock.product, Validators.required],
        consignment: [this.data.stock?.consignment],
        branch: [this.data.stock.branch, Validators.required],
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
    const stockUpdate: BaseUpdateStockDto = {
      type: this.data.stockType,
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
    if (this.data?.isUpdate && this.data.stock) {
      this.actions$.dispatch(StockActions.update({id: this.data.stock.id, updates: stockUpdate}));
    } else {
      this.actions$.dispatch(StockActions.addOne({body: value}));
    }

  }

  onPaginationProduct(index: number) {
    const count = this.productQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(ProductActions.loadAll({
        search: {take: PaginationDto.take, skip: count},
        isPaginate: true
      }));
    }
  }
}


