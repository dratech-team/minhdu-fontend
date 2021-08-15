import { Component, Input, OnInit } from '@angular/core';
import { stakedChart } from '@minhdu-fontend/data-models';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-swim-lane-chart',
  templateUrl: 'swim-lane-chart.component.html'
})
export class SwimLaneChartComponent implements OnInit {
  @Input() data!: stakedChart[];
  @Input() labelX!: string;
  @Input() labelY!: string;
  @Input() legend!: boolean;
  legendPosition = LegendPosition.Below;
  width = 0;
  height = 315;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#f86c6b', '#6f42c1']
  };

  ngOnInit() {
    this.data = this.chartService.editNameChart(this.data);
    this.width = this.chartService.fixWithChartMultiColumn(this.data);
  }

  constructor(
    private readonly chartService: ChartService
  ) {
  }
}
