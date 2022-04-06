import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { addBranch, getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAndAddAutocomplete } from '@minhdu-fontend/utils';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions } from '@datorama/akita-ng-effects';
import { StockQuery } from '../../state/stock.query';
import { AppState } from '../../../../reducers';
import { CategoryQuery } from '../../../category/state';
import { ProviderQuery } from '../../../provider/state';
import { ProviderActions } from '../../../provider/state';
import { CategoryAction } from '../../../category/state';
import { StockService } from '../../services';
import { StockActions } from '../../state/stock.actions';
import {UnitMedicineConstant} from "../../../../../shared/constant";

type InputType = 'branch' | 'warehouse' | 'provider';

@Component({
  templateUrl: 'stock-dialog.component.html'
})
export class StockDialogComponent implements OnInit {
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
    private readonly warehouseQuery: CategoryQuery,
    private readonly productQuery: StockQuery,
    private readonly productService: StockService,
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
    if(this.data?.isUpdate){
      this.action$.dispatch(StockActions.update({ id:this.data.stock.id, updates: value}));
    }else{
      this.action$.dispatch(StockActions.addOne({ body: value }));
    }

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
          this.action$.dispatch(CategoryAction.addOne({ body: { name: fg } }));
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


