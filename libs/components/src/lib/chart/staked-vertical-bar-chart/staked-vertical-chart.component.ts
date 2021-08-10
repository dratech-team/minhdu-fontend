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
  width = 400;
  colorScheme = {
    domain: ['#20a8d8', '#f86c6b']
  };

  ngOnChanges() {
    if (this.data) {
      this.data.length >=0 && this.data.length <6 ? this.width = 400:
        this.data.length >6 && this.data.length < 20 ? this.width = 800:
          this.data.length >20 && this.data.length < 30  ? this.width = 1800:
            this.data.length >30 && this.data.length < 40  ? this.width = 2400:
              this.data.length >40 && this.data.length < 50  ? this.width = 3200:
                this.data.length >50 && this.data.length < 60  ? this.width = 4000:
                  this.data.length >60 && this.data.length < 70  ? this.width = 4800:
                    this.data.length >70 && this.data.length < 80  ? this.width = 5600:
                      this.data.length >80 && this.data.length < 90  ? this.width = 6400: this.width = 7200;
      this.data.map((val, index) => {
            val.name = `${index + 1} - ${val.name}`;
        }
      );
    }
  }
}
