import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Api } from '@minhdu-fontend/constants';
import { ExportService } from '@minhdu-fontend/service';
import { FormControl, Validators } from '@angular/forms';
import { Employee } from '@minhdu-fontend/data-models';
import { ItemExportService } from '../../service/item-export.service';
import { FilterTypeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'dialog-export.component.html'
})
export class DialogExportComponent implements OnInit {
  name = new FormControl('', Validators.required);
  submitted = false;
  isSelectAll = true;
  itemsExport: any [] = [];
  itemSelected: any[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<DialogExportComponent>,
    private readonly itemExportService: ItemExportService,
    private readonly exportService: ExportService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.itemExportService.getItemExport({ exportType: this.data.exportType }).subscribe(val => {
      val.map((e, i) => {
        Object.assign(e, { index: i });
      });
      this.itemsExport = val;
      this.itemSelected = [...this.itemsExport];

    });
  }

  onSubmit(): any {
    this.submitted = true;
    if (!this.name.value) {
      return;
    }
    this.itemSelected.sort((a, b) => {
      return a.index - b.index;
    });
    this.exportService.print(
    this.data.api,
      Object.assign(this.data.params, { filename: this.name.value }),
      { items: this.itemSelected }
    );
    this.dialogRef.close();
  }

  someComplete(): boolean {
    return (
      this.itemsExport.filter((val: any) =>
        this.itemSelected.some((item: any) => item.key === val.key)
      ).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.itemsExport == null) {
      return;
    }
    this.itemsExport?.forEach((item: any) => {
      if (select) {
        if (!this.itemSelected.some((val: any) => val.key === item.key)) {
          this.itemSelected.push(item);
        }
      } else {
        const index = this.itemSelected.findIndex((val: any) => val.key === item.key);
        if (index > -1) {
          this.itemSelected.splice(index, 1);
        }
      }
    });
  }

  updateSelect(item: any) {
    const index = this.itemSelected.findIndex((val: any) => val.key === item.key);
    if (index > -1) {
      this.itemSelected.splice(index, 1);
    } else {
      this.itemSelected.push(item);
    }
    this.isSelectAll =
      this.itemsExport !== null &&
      this.itemsExport.every((item: any) => this.itemSelected.some((val: any) => val.key === item.key));
  }

  selectItem(val: any) {
    return this.itemSelected.some((item: any) => item.key === val.key);
  }
}
