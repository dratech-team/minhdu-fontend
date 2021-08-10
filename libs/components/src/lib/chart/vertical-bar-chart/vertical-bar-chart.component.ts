import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Statistical } from '@minhdu-fontend/data-models';

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl:'vertical-bar-chart.component.html'
})
export class VerticalBarChartComponent implements OnChanges{
  @Input() data!: Statistical[];
  @Input() labelX!: string
  @Input() labelY!: string
  @Input() legend!: boolean
  width =400
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#f86c6b','#6f42c1']
  };

ngOnChanges() {
  console.log(this.data.length)
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
