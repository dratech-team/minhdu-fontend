import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { stakedChart } from '@minhdu-fontend/data-models';

@Component({
  selector: 'app-staked-vertical-chart',
  templateUrl: 'staked-vertical-chart.component.html'
})
export class StakedVerticalChartComponent implements OnChanges {

  @Input() data!: stakedChart[];
  @Input() labelX!: string;
  @Input() labelY!: string;
  length = true;
  colorScheme = {
    domain: ['#20a8d8', '#f86c6b']
  };

  ngOnChanges() {
    let i = 1;
    if (this.data) {

      this.data.map((val, index) => {
          let sum = val.series.map(a => a.value).reduce(function(a, b) {
            return a + b;
          });
          if (sum > 0) {
            val.name = `${i++} - ${val.name}`;
          } else {
            this.data.splice(index, 1);
          }
        }
      );
    }
    console.log(i)
    i > 15? this.length = false: this.length = true;
  }
}
