import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { AppState } from '../../../../reducers';
import { MatDialog } from '@angular/material/dialog';
import { StatisticalEmployeeComponent } from '../../components/dialog-statistical-employee/statistical-employee.component';

@Component({
  templateUrl: 'overview.component.html'
})
export class OverviewComponent implements OnInit {
  data = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    }
  ]
  multi = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        }
      ]
    }
  ];

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog

  ) {

  }

  ngOnInit() {

  }

  statisticalEmployee() {
    this.dialog.open(StatisticalEmployeeComponent, { width: 'fit-content'})
  }
}
