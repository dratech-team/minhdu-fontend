import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  StatisticalEmployeeComponent
} from '../../components/dialog-statistical-employee/statistical-employee.component';
import {OverviewService} from '../../service/overview.service';
import {OverviewFilterEnum} from '@minhdu-fontend/enums';
import {Chart, stakedChart} from '@minhdu-fontend/data-models';

@Component({
  templateUrl: 'overview.component.html'
})
export class OverviewHrComponent implements OnInit {
  overviewAgeEmployee: Chart [] = [];
  overviewTotalEmployee:stakedChart [] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly overviewService: OverviewService
  ) {

  }

  ngOnInit() {
    this.overviewService.overviewAge({ filter: OverviewFilterEnum.AGE }).subscribe(val => {
      this.overviewAgeEmployee = val;
    });
    this.overviewService.overviewTotalEmp({ filter: OverviewFilterEnum.CREATED_AT }).subscribe(val => {
      this.overviewTotalEmployee = val;
    });
  }

  statisticalEmployee() {
    this.dialog.open(StatisticalEmployeeComponent, { width: 'fit-content' });
  }
}
