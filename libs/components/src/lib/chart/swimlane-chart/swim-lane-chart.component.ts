import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { stakedChart } from '@minhdu-fontend/data-models';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-swim-lane-chart',
  templateUrl: 'swim-lane-chart.component.html',
  styleUrls: ['swim-lane-chart.component.scss']
})
export class SwimLaneChartComponent implements OnInit, OnChanges {
  constructor(private readonly chartService: ChartService) {
  }

  @Input() data!: stakedChart[];
  @Input() labelX!: string;
  @Input() labelY!: string;
  @Input() legend!: boolean;
  legendPosition = LegendPosition.Below;
  width = 0;
  height = 315;

  ngOnInit() {
    this.data = this.chartService.generateNameChart(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue !== changes.data.previousValue) {
      this.width = this.chartService.fitWidth(changes.data.currentValue);
      this.height = this.chartService.fitHeight(changes.data.currentValue);
    }
  }
}
