import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllMaterial } from '../../+state/material.selector';
import { MaterialAction } from '../../+state/material.action';
import { MenuEnum, WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MaterialDialogComponent } from '../../components/material-dialog/material-dialog.component';
import { debounceTime, map } from 'rxjs/operators';
import { MainAction } from '../../../../../states/main.action';

@Component({
  selector: 'app-material',
  templateUrl: 'material.component.html'
})
export class MaterialComponent implements OnInit {
  material$ = this.store.pipe(select(selectorAllMaterial));
  applianceWarehouse = WarehouseTypeEnum.MATERIAL;
  formGroup = new FormGroup(
    {
      name: new FormControl('')
    }
  );
  pageSize = 30;
  pageIndex = 1;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.WAREHOUSE_SUPPLIES}))
    this.store.dispatch(MaterialAction.loadInit({ take: 30, skip: 0 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(val => {
          this.store.dispatch(MaterialAction.loadInit(this.material(30, 0, val)));
        }
      )
    );
  }

  importMaterial() {
    this.dialog.open(MaterialDialogComponent, { width: '40%' });
  }

  updateMaterial($event: any) {
    this.dialog.open(MaterialDialogComponent, {
      width: '40%',
      data: $event,
    });
  }

  material(pageSize: number, pageIndex: number, val: any) {
    const value = this.formGroup.value;
    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      name: value.name
    };
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(MaterialAction.loadMoreMaterials(this.material(this.pageSize, this.pageIndex, val)));
  }

  exportMaterial() {

  }
}
