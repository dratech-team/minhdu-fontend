import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl:'history-position.component.html',
})
export class HistoryPositionComponent implements OnInit{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit() {
  }
}
