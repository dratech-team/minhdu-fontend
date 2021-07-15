import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'statistical.component.html'
})
export class StatisticalComponent implements OnInit {
   single = [
    {
      "name": "Bình Định",
      "value": 90
    },
    {
      "name": "Phú Yên",
      "value": 10
    },
    {
      "name": "Khánh Hòa",
      "value": 300
    },
     {
       "name": "Quãng Ngãi",
       "value": 150
     },
     {
       "name": "Đà Nãng",
       "value": 110
     },

  ];
  view:[number, number] = [600, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Tỉnh thành';
  showYAxisLabel = true;
  yAxisLabel = 'Số lượng đơn hàng';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  constructor() {
  }
  ngOnInit() {
  }
}
