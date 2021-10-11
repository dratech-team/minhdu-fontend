import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MaintainService } from '../services/maintain.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl:'dialog-maintain.html'
})
export class DialogMaintain implements OnInit{
  datetime = new FormControl();
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private readonly maintainService :MaintainService,
  ) {
  }
  ngOnInit() {
  }
  onSubmit(): any{
    this.maintainService.postMaintain(
      {
        id: this.id,
        datetime: this.datetime.value ? new Date(this.datetime.value): null
      }).subscribe()
  }
}
