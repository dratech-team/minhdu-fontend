import { stakedChart } from '@minhdu-fontend/data-models';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ChartService {
  fitWidth(data: stakedChart[]): number {
    return this.convertSizeWidth(0, 5, data.length, 400);
  }

  fitHeight(data: stakedChart[]): number {
    const cloneDeep = _.flattenDeep(data.map(e => e.series.map(a => a.value))) as number[];
    const max = Math.max(...cloneDeep);
    return 450;
  }

  generateNameChart(data: stakedChart[]) {
    data.map((val, index) => {
      val.name = `${index + 1}-${val.name}`;
    });
    return data;
  }

  private convertSizeWidth(min: number, max: number, length: number, size: number): number {
    if (min <= length && length < max) {
      return size;
    } else {
      min = max;
      max = max + 5;
      size = size + 400;
      return this.convertSizeWidth(min, max, length, size);
    }
  }
}
