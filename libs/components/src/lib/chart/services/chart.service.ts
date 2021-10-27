import { stakedChart } from '@minhdu-fontend/data-models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChartService {

  fixWithChartColumn(data: stakedChart[]): number {
   return  this.check(0,5,data.length, 600)
  };


  check(min: number , max: number, length : number,width: number ): number{
        if(min <= length && length < max){
            return width
        }else{
          min = max ; max = max + 5 ; width = width + 600;
          return  this.check(min , max , length, width)
        }
  }
  editNameChart(data: stakedChart[]) {
    data.map((val, index) => {
        val.name = `${index + 1}-${val.name}`;
      }
    );
    return data;
  }

}
