import { Component, Input } from '@angular/core';

@Component({
  selector:'app-staked-vertical-chart',
  templateUrl:'staked-vertical-chart.component.html'
})
export class StakedVerticalChartComponent{
  @Input() data!: any;
  @Input() labelX!: string
  @Input() labelY!: string
  colorScheme = {
    domain: ['#20a8d8', '#f86c6b',]
  };
}
