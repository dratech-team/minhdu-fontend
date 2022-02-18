import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { UnitMedicineConstant } from '@minhdu-fontend/constants';
import { addBranch, getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAndAddAutocomplete } from '@minhdu-fontend/utils';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions } from '@datorama/akita-ng-effects';
import { ProductQuery } from '../../state/product.query';
import { AppState } from '../../../../reducers';
import { WarehouseQuery } from '../../../warehouse/state/warehouse.query';
import { ProviderQuery } from '../../../provider/state/provider.query';
import { ProviderActions } from '../../../provider/state/provider.action';
import { WarehouseAction } from '../../../warehouse/state/warehouse.action';
import { ProductAction } from '../../state/product.action';
import { ProductService } from '../../services/product.service';
import { Product } from '../../entities/product.entity';

type InputType = 'branch' | 'warehouse' | 'provider';

@Component({
  templateUrl: 'product-dialog.component.html'
})
export class ProductDialogComponent implements OnInit {
  branches$ = this.store.select(getAllOrgchart).pipe(map(branches => branches.concat({ id: -1, name: 'Kho tổng' })));
  warehouse$ = this.warehouseQuery.selectAll();
  providers$ = this.providerQuery.selectAll();
  products$ = this.productQuery.selectAll();

  medicineConstant = UnitMedicineConstant;
  warehouseId = this.warehouseQuery.getValue().selected;

  formGroup = this.formBuilder.group({
    product: [this.data?.name, Validators.required],
    code: [this.data?.code, Validators.required],
    mfg: [
      this.datePipe.transform(
        this?.data?.mfg, 'yyyy-MM-dd'
      )
      , Validators.required],
    exp: [
      this.datePipe.transform(
        this?.data?.exp, 'yyyy-MM-dd'
      )
      , Validators.required],
    accountedAt: [this.data?.accountedAt, Validators.required],
    billedAt: [this.data?.billedAt, Validators.required],
    billCode: [this.data?.billCode, Validators.required],
    branch: [this.data?.branchId],
    warehouse: [this.warehouseQuery.getEntity(this.warehouseId)?.name],
    price: [this.data?.price, Validators.required],
    amount: [this.data?.amount, Validators.required],
    discount: [this.data?.discount ? this.data.discount * 100 : undefined, Validators.required],
    provider: [this.data?.provider, Validators.required],
    note: [this.data?.note],
    transferBranch: [],
    invoice: [this?.data?.invoice, Validators.required],
    unit: [this?.data?.unit || UnitMedicineConstant[1].value, Validators.required],
    createdAt: [
      this.datePipe.transform(
        this?.data?.createdAt || new Date(), 'yyyy-MM-dd'
      )
      , Validators.required
    ]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly warehouseQuery: WarehouseQuery,
    private readonly productQuery: ProductQuery,
    private readonly productService: ProductService,
    private readonly providerQuery: ProviderQuery,
    private readonly action$: Actions
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.action$.dispatch(ProviderActions.loadProviders());

    this.branches$ = searchAndAddAutocomplete(
      this.formGroup.get('branch')?.valueChanges?.pipe(startWith('')) || of(''),
      this.branches$
    );

    this.providers$ = searchAndAddAutocomplete(
      this.formGroup.get('provider')?.valueChanges?.pipe(startWith('')) || of(''),
      this.providers$
    );

    this.formGroup.get('product')?.valueChanges.pipe(
      debounceTime(1500)
    ).subscribe((val => {
      this.products$ = this.productService.pagination({ take: 10, skip: 0, name: val }).pipe(map(data => data.data));
    }));
  }

  onClick(event: any) {
    this.store.dispatch(OrgchartActions.init());
  }

  onSubmit() {
    const value = this.formGroup.value;
    console.log(value)
    const product = {
      name: value.name,
      code: value?.code,
      mfg: value?.mfg,
      exp: value?.exp,
      accountedAt: value?.accountedAt,
      billedAt: value?.billedAt,
      billCode: value?.billCode,
      branchId: value?.branch?.id > 0 ? value.branch.id : null,
      warehouseId: value.warehouse.id,
      price: value.price,
      amount: value.amount,
      discount: value?.discount ? value.discount / 100 : undefined,
      providerId: value.provider.id,
      note: value?.note,
      unit: value.unit,
      createdAt: value.createdAt
    };

    // this.action$.dispatch(ProductAction.addProduct({ product: product }));
    // if (this.data?.isUpdate) {
    //   console.log("update product")
    //   // this.store.dispatch(MedicineAction.updateMedicine({ medicine: medicine, id: this.data.id }));
    // } else {
    //   this.action$.dispatch(ProductAction.addProduct({ product: product }));
    // }
  }

  onChangeAutoComp(event: any, value: any, type: InputType) {
    const fg = this.formGroup.get(type)?.value;
    if (!value?.id) {
      switch (type) {
        case 'branch': {
          this.store.dispatch(addBranch({ branch: { name: fg } }));
          break;
        }
        case 'provider': {
          this.action$.dispatch(ProviderActions.addProvider({ name: fg }));
          break;
        }
        case 'warehouse': {
          this.action$.dispatch(WarehouseAction.addWarehouse({ warehouse: { name: fg } }));
          break;
        }
        default: {
          console.error('[product-dialog.component.ts] Type onChange Autocomplete unavailble');
        }
      }
      this.formGroup.get(type)?.patchValue(fg);
    } else {
      this.formGroup.get(type)?.patchValue(value.name);
    }
  }

  onSelectItem(event: Product) {
    this.data = event;
  }
}


