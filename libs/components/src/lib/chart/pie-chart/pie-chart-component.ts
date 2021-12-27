import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Chart } from '@minhdu-fontend/data-models';


@Component({
  selector:'app-pie-chart',
  templateUrl:'pie-chart-component.html'
})
export class PieChartComponent implements  OnInit{
  @Input() data!: Chart[]
  @Input() view!: any
  legendPosition = LegendPosition.Below;
  ngOnInit() {
  }
}
