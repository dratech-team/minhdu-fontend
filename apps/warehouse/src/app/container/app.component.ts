import { Component, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';

@Component({
  selector: 'minhdu-fontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{

  warehouseTypeEnum = WarehouseTypeEnum;
  constructor() {
  }
  ngOnInit() {
  }
}
