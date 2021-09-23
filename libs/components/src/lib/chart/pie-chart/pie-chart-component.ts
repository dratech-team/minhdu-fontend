import { Component, Input } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';


@Component({
  selector:'app-pie-chart',
  templateUrl:'pie-chart-component.html'
})
export class PieChartComponent {
  @Input() data!: any
  legendPosition = LegendPosition.Below;
}
