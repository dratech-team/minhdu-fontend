import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Api } from '@minhdu-fontend/constants';
import { stakedChart, Statistical } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum, FilterOverviewEnum, MenuEnum, OptionOverviewEnum,
  StatisticalXType,
  StatisticalYType
} from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { getMonth } from 'ngx-bootstrap/chronos';
import { PickStatisticalTypeComponent } from '../../component/pick-statistical-type/pick-statistical-type.component';
import { StatisticalService } from '../../service/statistical/statistical.service';
import { document } from 'ngx-bootstrap/utils';
import { Store } from '@ngrx/store';
import { MainAction } from '../../../../states/main.action';
import { getFirstDayInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'statistical.component.html',
  styleUrls: ['statistical.component.scss']
})
export class StatisticalComponent implements OnInit {
  statisticalProvince: stakedChart[] = [];
  statisticalAgency: stakedChart[] = [];
  statisticalPotential: stakedChart[] = [];
  TotalPotential = 0;
  totalOrders = 0;
  date = new Date();
  optionOverview = OptionOverviewEnum;
  api = Api;
  CurrentMonth = getMonth(new Date()) + 1;
  statisticalCustomerData: stakedChart[] = [];
  statisticalDebt: stakedChart[] = [];
  statisticalYear: Statistical[] = [];
  statisticalYType = StatisticalYType;
  filterOverview = FilterOverviewEnum;
  dateTime = DatetimeUnitEnum;
  labelYProvince!: string;
  labelYYear!: string;
  labelYAgency!: string;
  labelYCustomer!: string;
  firstDayInCurrentMonth = getFirstDayInMonth(new Date());

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly statisticalService: StatisticalService,
    private readonly exportService: ExportService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.HOME }));
    this.onStatistical(this.filterOverview.NATION, {
      option: OptionOverviewEnum.SALES
    });
    this.onStatistical(this.filterOverview.YEAR, {
      option: OptionOverviewEnum.SALES
    });

    this.onStatistical(this.filterOverview.AGENCY, {
      option: OptionOverviewEnum.SALES
    });
  }


  onStatistical(type: FilterOverviewEnum, params: any) {
    const value = {
      startedAt: params.startedAt,
      endedAt: params.endedAt,
      option: params.option
    };
    if (!params.startedAt) {
      delete value.startedAt;
      delete value.endedAt;
    }
    switch (type) {
      case this.filterOverview.AGENCY:
        Object.assign(value, { filter: FilterOverviewEnum.AGENCY });
        this.labelYAgency = this.setLabelY(params.option);
        this.statisticalService
          .getAll(Api.SELL.OVERVIEW, value)
          .subscribe((value) => {
            if (value) {
              this.snackbar.open('Thống kê thành công', '', { duration: 1500 });
              this.statisticalAgency = value;
            }
          });
        break;
      case this.filterOverview.YEAR:
        Object.assign(value, { filter: FilterOverviewEnum.YEAR });
        this.labelYYear = this.setLabelY(params.option);
        this.statisticalService
          .getAll(Api.SELL.OVERVIEW, value)
          .subscribe((value) => {
            if (value) {
              this.snackbar.open('Thống kê thành công', '', { duration: 1500 });
              this.statisticalYear = value;
            }
          });
        break;
      case this.filterOverview.NATION:
        Object.assign(value, { filter: FilterOverviewEnum.NATION });
        this.labelYProvince = this.setLabelY(params.option);
        this.statisticalService
          .getAll(Api.SELL.OVERVIEW, value)
          .subscribe((value) => {
            if (value) {

              this.snackbar.open('Thống kê thành công', '', { duration: 1500 });
              this.statisticalProvince = value;
            }
          });
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
    }
  }
}
