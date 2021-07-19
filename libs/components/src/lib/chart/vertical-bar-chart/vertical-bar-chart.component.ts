import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl:'vertical-bar-chart.component.html'
})
export class VerticalBarChartComponent {
  @Input() data!: any;
  @Input() labelX!: string
  @Input() labelY!: string
  @Input() legend!: boolean

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#f86c6b','#6f42c1']
  };


}
