import { Component, OnInit } from '@angular/core';
import {  Store } from '@ngrx/store';

import { Router } from '@angular/router';

@Component({
  selector: 'app-wareHouse',
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss'],
})
export class WarehouseLayoutComponent implements OnInit{

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
  }
  changeTab(event: any) {
    const btnHeader = document.getElementsByClassName('btn-header')
    for (let i = 0; i < btnHeader.length; i++) {
      btnHeader[i].classList.remove('btn-border')
    }
    event.classList.add('btn-border')
  }
}
