import { Component, OnInit } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { stakedChart } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterOverviewEnum,
  OptionOverviewEnum,
} from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { StatisticalService } from '../../service/statistical/statistical.service';

@Component({
  selector: 'minhdu-fontend-overview-sell',
  templateUrl: 'statistical.component.html',
  styleUrls: ['statistical.component.scss'],
})
export class StatisticalComponent implements OnInit {
  Api = Api;
  statisticalProvince: stakedChart[] = [];
  statisticalAgency: stakedChart[] = [];
  statisticalYear: stakedChart[] = [];
  filterOverview = FilterOverviewEnum;
  dateTime = DatetimeUnitEnum;
  labelYProvince!: string;
  labelYYear!: string;
  labelYAgency!: string;

  constructor(
    private readonly statisticalService: StatisticalService,
    private readonly exportService: ExportService
  ) {}

  ngOnInit() {
    this.onStatistical(this.filterOverview.NATION, {
      option: OptionOverviewEnum.SALES,
    });
    this.onStatistical(this.filterOverview.YEAR, {
      option: OptionOverviewEnum.SALES,
    });

    this.onStatistical(this.filterOverview.CUSTOMER, {
      option: OptionOverviewEnum.SALES,
    });
  }

  onStatistical(type: FilterOverviewEnum, params: any) {
    const value = {
      startedAt: params.startedAt,
      endedAt: params.endedAt,
      option: params.option,
    };
    if (!params.startedAt) {
      delete value.startedAt;
      delete value.endedAt;
    }
    switch (type) {
      case this.filterOverview.CUSTOMER: {
        Object.assign(value, { filter: FilterOverviewEnum.CUSTOMER });
        this.labelYAgency = this.setLabelY(params.option);
        this.statisticalService
          .getAll(Api.SELL.OVERVIEW, value)
          .subscribe((value) => {
            if (value) {
              this.statisticalAgency = value;
            }
          });
        break;
      }
      case this.filterOverview.NATION: {
        Object.assign(value, { filter: FilterOverviewEnum.NATION });
        this.labelYProvince = this.setLabelY(params.option);
        this.statisticalService
          .getAll(Api.SELL.OVERVIEW, value)
          .subscribe((value) => {
            if (value) {
              this.statisticalProvince = value;
            }
          });
        break;
      }
      case this.filterOverview.YEAR: {
        Object.assign(value, { filter: FilterOverviewEnum.YEAR });
        this.labelYYear = this.setLabelY(params.option);
        this.statisticalService
          .getAll(Api.SELL.OVERVIEW, value)
          .subscribe((value) => {
            if (value) {
              this.statisticalYear = value;
            }
          });
        break;
      }
    }
  }

  printStatistical(url: any, params: any) {
    this.exportService.print(url, params);
  }

  setLabelY(type: OptionOverviewEnum): string {
    switch (type) {
      case OptionOverviewEnum.CUSTOMER:
        return 'Khách hàng';
      case OptionOverviewEnum.SOLD:
        return 'Gà bán';
      case OptionOverviewEnum.SALES:
        return 'Doanh thu';
      case OptionOverviewEnum.DEBT:
        return 'Công nợ';
      default:
        return 'Unavailable';
    }
  }
}
