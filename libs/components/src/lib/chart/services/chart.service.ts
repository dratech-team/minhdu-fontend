import { stakedChart } from '@minhdu-fontend/data-models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChartService {
  fixWithChartMultiColumn(data: stakedChart[]) {
    let width = 0;
    if (data) {
      data.length >= 0 && data.length < 3 ? width = 580 :
        data.length >= 3 && data.length < 6 ? width = 1000 :
          data.length >= 6 && data.length < 10 ? width = 1600 :
            data.length >= 10 && data.length < 16 ? width = 2400 :
              data.length >= 16 && data.length < 20 ? width = 3200 :
                data.length >= 20 && data.length < 30 ? width = 4800 :
                  data.length >= 30 && data.length < 40 ? width = 5600 :
                    data.length >= 40 && data.length < 50 ? width = 6200 :
                      data.length >= 50 && data.length < 60 ? width = 7000 :
                        data.length >= 60 && data.length < 70 ? width = 7800 :
                          data.length >= 70 && data.length < 80 ? width = 8600 :
                            data.length >= 80 && data.length < 90 ? width = 9400 : width = 10000;
    }
    return width;
  };

  fixWithChartColumn(data: stakedChart[]) {
    let width = 0;
    if (data) {
      data.length >= 0 && data.length < 3 ? width = 300 :
        data.length >= 3 && data.length < 6 ? width = 800 :
          data.length >= 6 && data.length < 10 ? width = 1200 :
            data.length >= 10 && data.length < 16 ? width = 1600 :
              data.length >= 16 && data.length < 20 ? width = 2000 :
                data.length >= 20 && data.length < 36 ? width = 2400 :
                  data.length >= 26 && data.length < 30 ? width = 3200 :
                    data.length >= 30 && data.length < 36 ? width = 3600 :
                      data.length >= 36 && data.length < 40 ? width = 4000 :
                        data.length >= 40 && data.length < 46 ? width = 4400 :
                          data.length >= 46 && data.length < 50 ? width = 4800 :
                            data.length >= 50 && data.length < 56 ? width = 5200 :
                              data.length >= 56 && data.length < 60 ? width = 5600 : 6000;
    }
    return width;
  };

  editNameChart(data: stakedChart[]) {
    data.map((val, index) => {
        val.name = `${index + 1}-${val.name}`;
      }
    );
    return data;
  }

}
