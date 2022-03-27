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
import { ProductService } from '../../services';
import { ProductActions } from '../../state/product.actions';

type InputType = 'branch' | 'warehouse' | 'provider';

@Component({
  templateUrl: 'product-dialog.component.html'
})
export class ProductDialogComponent implements OnInit {
  branches$ = this.store.select(getAllOrgchart);
  warehouse$ = this.warehouseQuery.selectAll();
  products$ = this.productQuery.selectAll();

  medicineConstant = UnitMedicineConstant;
  warehouseId = this.warehouseQuery.getValue().selected;
  providerOptions: Array<any> = this.providerQuery.getAll().map(e => ({ label: e.name, value: e.id }));

  formGroup = this.formBuilder.group({
    name: [this.data?.name, Validators.required],
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
    unit: [this?.data?.unit || UnitMedicineConstant[1].value, Validators.required]
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
    this.action$.dispatch(ProviderActions.loadAll( { take: 30, skip: 0 }));

    this.branches$ = searchAndAddAutocomplete(
      this.formGroup.get('branch')?.valueChanges?.pipe(startWith('')) || of(''),
      this.branches$
    );

    this.formGroup.get('product')?.valueChanges.pipe(
      debounceTime(1500)
    ).subscribe((val => {
      this.products$ = this.productService.pagination({ take: 10, skip: 0, name: val }).pipe(map(data => data.data));
    }));
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (!this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;

    this.action$.dispatch(ProductActions.addOne({ product: value }));
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
          // this.action$.dispatch(ProviderActions.addProvider({ name: fg }));
          break;
        }
        case 'warehouse': {
          this.action$.dispatch(WarehouseAction.addOne({ body: { name: fg } }));
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

  onChangeProvider(value: string): void {
    this.providerOptions = this.providerQuery
      .getAll({ filterBy: [entity => entity.name.toLowerCase().indexOf(value.toLowerCase()) !== -1] })
      .map(e => ({ label: e.name, value: e.id }));
  }

  onSelectItem(event: any) {
    const data = Object.assign({}, event, {
      branch: event.branch.name,
      warehouse: event.warehouse.name,
      provider: event.provider.name,
      amount: null
    });
    this.formGroup.reset(data);
  }
}


