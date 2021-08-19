import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-wareHouse',
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss'],
})
export class WarehouseLayoutComponent implements OnInit{

  constructor(
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
