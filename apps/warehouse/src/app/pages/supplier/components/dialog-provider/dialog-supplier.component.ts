import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Actions} from '@datorama/akita-ng-effects';
import {SupplierActions, SupplierQuery} from '../../state';
import {SupplierEntity} from '../../entities';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'dialog-supplier.component.html'
})
export class DialogSupplierComponent implements OnInit {
  @Input() data?: { supplier?: SupplierEntity, isUpdate?: boolean }
  loading$ = this.supplierQuery.select(state => state.loading)
  formGroup!: UntypedFormGroup;
  submitted = false;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly supplierQuery: SupplierQuery,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit() {
    if (this.data?.supplier) {
      this.formGroup = this.formBuilder.group({
        name: [this.data.supplier.name, Validators.required],
        phone: [this.data.supplier?.phone],
        email: [this.data.supplier?.email]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        phone: [],
        email: []
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const provider: Partial<SupplierEntity> = {
      name: value.name,
      phone: value?.phone,
      email: value?.address
    };
    if (this.data?.isUpdate && this.data.supplier) {
      this.actions$.dispatch(SupplierActions.update({id: this.data.supplier.id, updates: provider}));
    } else {
      this.actions$.dispatch(SupplierActions.addOne({body: provider}));
    }

    this.loading$.subscribe(loading => {
      if (loading === false) {
        this.modalRef.close();
      }
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }
}
