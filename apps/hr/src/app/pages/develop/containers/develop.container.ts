import { Component, OnInit } from '@angular/core';
import { MaintainService } from '../services/maintain.service';
import { Observable } from 'rxjs';
import { SystemType } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { DialogMaintain } from '../components/dialog-maintain';

@Component({
  templateUrl: 'develop.container.html'
})
export class DevelopContainer implements OnInit {
  features$!: Observable<any>;
  systemType = SystemType;
  constructor(
    private readonly maintainService: MaintainService,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.features$ = this.maintainService.getMaintain();
  }

  maintain(id: number) {
    this.dialog.open(DialogMaintain, { width: '30%', data: id })
  }
}
