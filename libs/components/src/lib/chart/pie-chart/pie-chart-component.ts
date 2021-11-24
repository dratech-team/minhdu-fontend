import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';


@Component({
  selector:'app-pie-chart',
  templateUrl:'pie-chart-component.html'
})
export class PieChartComponent implements  OnInit{
  @Input() data!: any
  @Input() view!: any
  legendPosition = LegendPosition.Below;
  ngOnInit() {
  }
}
