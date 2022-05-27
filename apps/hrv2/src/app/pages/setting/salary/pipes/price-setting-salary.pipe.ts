import {Pipe, PipeTransform} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {SalarySettingEntity} from "../entities";
import {PricesPipe} from "./prices.pipe";
import {SalaryTypePipe} from "./salary-type.pipe";

@Pipe({
  name: 'pricesettingsalary',
})
export class PriceSettingSalaryPipe implements PipeTransform {
  constructor(
    private readonly pricesPipe: PricesPipe,
    private readonly salaryTypePipe: SalaryTypePipe,
  ) {
  }

  transform(settingSalary: SalarySettingEntity): any {
    switch (settingSalary.type) {
      case SalaryTypeEnum.ABSENT:
      case SalaryTypeEnum.OVERTIME:
      case SalaryTypeEnum.HOLIDAY:
        return ((settingSalary.prices && settingSalary.prices.length > 0
          ? (this.pricesPipe.transform(settingSalary.prices))
          : ( this.salaryTypePipe.transform(settingSalary.totalOf, 'transform')))
        + (settingSalary.workday
          ? (settingSalary.workday > 1
            ? ' / ' +  settingSalary.workday.toString()
            : '')
          : (settingSalary.type === SalaryTypeEnum.OVERTIME && settingSalary.totalOf.length === 0
              ? ''
              : ' / Ngày công chuẩn'
          ))
      )
      default:
        return this.pricesPipe.transform(settingSalary.prices)
    }
  }
}
