import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  templateUrl: './snack-bar.component.html',
})
export class SnackBarComponent implements OnInit{
  content!: string
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
  ngOnInit() {
    this.content = this.data.content
  }
}
