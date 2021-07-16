import { Component, OnInit } from '@angular/core';
import { Chart, stakedChart } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'statistical.component.html'
})
export class StatisticalComponent implements OnInit {
  dateTime = DatetimeUnitEnum;
   data = [
     {
       province: "Sài Gòn",
       amount: 90
     },
    {
      province: "Bình Định",
      amount: 90
    },
    {
      province: "Phú Yên",
      amount: 10
    },
    {
      province: "Khánh Hòa",
      amount: 300
    },
     {
       province: "Quãng Ngãi",
       amount: 150
     },
     {
       province: "Đà Nãng",
       amount: 110
     },

  ];
   multi = [
    {
      name: "Hưng thịnh",
      debt: 50,
      paidTotal:300,
    },
     {
       name: "Thinh Phát",
       debt: 70,
       paidTotal:400,
     },
     {
       name: " Phát Đạt",
       debt: 62,
       paidTotal:189,
     },
     {
       name: "Cao Tuấn",
       debt: 45,
       paidTotal:311,
     },
     {
       name: "Hồng Phát",
       debt: 22,
       paidTotal:454,
     },
     {
       name: "Gia Hiệu",
       debt: 90,
       paidTotal:700,
     },
  ];
   Data:Chart [] = [];
   stakedData: stakedChart[] =[];
  constructor() {
  }
  ngOnInit() {
     this.data.forEach( val => {
      this.Data.push(
        { name: val.province, value: val.amount}
      )
    })
    this.multi.forEach(val =>
      {
        this.stakedData.push(
          {
            name: val.name,
            series:[
              {
                name: 'Doanh thu',
                value: val.paidTotal
              },
              {
                name: 'Công nợ',
                value: val.debt
              }
              ]
          }
        )
      })
  }

  onStatistical(event: any) {
    console.log(event)
  }
}
