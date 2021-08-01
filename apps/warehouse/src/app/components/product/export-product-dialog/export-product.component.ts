import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl:'export-product.component.html'
})
export class ExportProductComponent implements OnInit{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
  }
  ngOnInit() {
  }

}
