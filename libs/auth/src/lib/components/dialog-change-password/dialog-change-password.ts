import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'dialog-change-password.html'
})
export class DialogChangePassword implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onClick(): boolean {
    return true;
  }
  ngOnInit() {
  }
}
