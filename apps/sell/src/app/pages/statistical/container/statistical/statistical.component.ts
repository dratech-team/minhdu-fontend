import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Api } from '@minhdu-fontend/constants';
import { stakedChart, Statistical } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  StatisticalXType,
  StatisticalYType,
} from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { getMonth } from 'ngx-bootstrap/chronos';
import { PickStatisticalTypeComponent } from '../../component/pick-statistical-type/pick-statistical-type.component';
import { StatisticalService } from '../../service/statistical/statistical.service';
import { document } from 'ngx-bootstrap/utils';

@Component({
  templateUrl: 'statistical.component.html',
  styleUrls: ['statistical.component.scss'],
})
export class StatisticalComponent implements OnInit {
  statisticalProvince: stakedChart[] = [];
  statisticalAgency: stakedChart[] = [];
  statisticalPotential: stakedChart[] = [];
  TotalPotential = 0;
  totalOrders = 0;
  date = new Date();
  CurrentMonth = getMonth(new Date()) + 1;
  statisticalCustomerData: stakedChart[] = [];
  statisticalDebt: stakedChart[] = [];
  statisticalChicken: Statistical[] = [];
  statisticalYType = StatisticalYType;
  statisticalXType = StatisticalXType;
  formGroup!: FormGroup;
  dateTime = DatetimeUnitEnum;
  labelY!: string;
  labelYCustomer!: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly statisticalService: StatisticalService,
    private readonly exportService: ExportService
  ) {}

  ngOnInit() {
    document.getElementById('systemHistory').classList.remove('btn-border');
    this.statisticalService
      .getAll(Api.STATISTICAL_PROVINCE, {
        type: this.statisticalYType.ORDER,
        startedAt: new Date(this.date.getFullYear(), this.date.getMonth(), 1),
        endedAt: new Date(),
      })
      .subscribe((val) => {
        val.forEach((value) => {
          value.series.forEach(
            (item: any) => (this.totalOrders = this.totalOrders + item.value)
          );
        });
      });
    this.statisticalCustomer({ type: this.statisticalYType.POTENTIAL });
    this.statisticalCustomer({ type: this.statisticalYType.COMMODITY_DETAIL });
    const btnOrder = document.getElementById('home');
    btnOrder?.classList.add('btn-border');
    this.formGroup = this.formBuilder.group({
      type: [Validators.required],
      startedAt: [Validators.required],
      endedAt: [Validators.required],
    });
  }

  onStatistical(type: StatisticalXType) {
    const ref = this.dialog.open(PickStatisticalTypeComponent, {
      width: '30%',
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        const value = {
          startedAt: val.startedAt,
          endedAt: val.endedAt,
          type: val.type,
        };
        switch (type) {
          case this.statisticalXType.AGENCY:
            this.statisticalService
              .getAll(Api.STATISTICAL_AGENCY, value)
              .subscribe((value) => {
                if (val) {
                  this.statisticalAgency = value;
                }
              });
            if (val.print) {
              this.exportService.print(Api.STATISTICAL_AGENCY_PRINT, value);
            }
            break;
          case this.statisticalXType.CHICKEN_TYPE:
            this.statisticalService
              .getAll(Api.STATISTICAL_CHICKEN, value)
              .subscribe((value) => {
                if (val) {
                  this.statisticalChicken = value;
                }
              });
            if (val.print) {
              this.exportService.print(Api.STATISTICAL_CHICKEN_PRINT, value);
            }
            break;
          case this.statisticalXType.PROVINCE:
            this.statisticalService
              .getAll(Api.STATISTICAL_PROVINCE, value)
              .subscribe((value) => {
                if (value) {
                  this.statisticalProvince = value;
                }
              });
            if (val.print) {
              this.exportService.print(Api.STATISTICAL_PROVINCE_PRINT, value);
            }
        }
        switch (val.type) {
          case this.statisticalYType.CUSTOMER:
            this.labelY = 'Khách hàng';
            break;
          case this.statisticalYType.REVENUE:
            this.labelY = 'Doanh thu';
            break;
          default:
            this.labelY = 'Số lượng';
        }
      }

    });
  }

  printCustomer(type: StatisticalYType) {
    this.exportService.print(Api.STATISTICAL_CUSTOMER_PRINT, type);
  }

  statisticalCustomer(param: any) {
    this.statisticalService
      .getAll(Api.STATISTICAL_CUSTOMER, param)
      .subscribe((value) => {
        if (value) {
          switch (param.type) {
            case this.statisticalYType.POTENTIAL:
              this.statisticalPotential = value;
              this.statisticalPotential.forEach((val) => {
                this.TotalPotential = this.TotalPotential + val.series[0].value;
              });
              break;
            case this.statisticalYType.COMMODITY_DETAIL:
              this.labelYCustomer = 'Số lượng gà';
              this.statisticalCustomerData = value;
              break;
            case this.statisticalYType.DEBT:
              this.labelYCustomer = 'Số Tiền';
              this.statisticalDebt = value;
              break;
          }
        }
      });
  }
}
