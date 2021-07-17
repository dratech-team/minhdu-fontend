import { Component, Input } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';


@Component({
  selector:'app-pie-chart',
  templateUrl:'pie-chart-component.html'
})
export class PieChartComponent {
  @Input() data!: any
  legendPosition = LegendPosition.Below;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#f86c6b','#6f42c1']
  };
}
