import { Component, Input, OnChanges } from '@angular/core';
import { stakedChart } from '@minhdu-fontend/data-models';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ChartService } from '../services/chart.service';


@Component({
  selector: 'app-staked-vertical-chart',
  templateUrl: 'staked-vertical-chart.component.html'
})
export class StakedVerticalChartComponent implements OnChanges {
  @Input() data!: stakedChart[];
  @Input() labelX!: string;
  @Input() labelY!: string;
  @Input() legend = false;
  legendPosition = LegendPosition.Below;
  width = 0;
  height = 315;
  colorScheme = {
    domain: ['#20a8d8', '#f86c6b', '#4dbd74', '#f8cb00', '#6f42c1']
  };

  ngOnChanges() {
    this.data = this.chartService.editNameChart(this.data);
    this.width = this.chartService.fixWithChartColumn(this.data)

  }

  constructor(
    private readonly chartService: ChartService
  ) {
  }
}
