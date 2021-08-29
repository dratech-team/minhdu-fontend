import { Component, OnInit } from '@angular/core';
import { DatetimeUnitEnum, StatisticalXType, StatisticalYType } from '@minhdu-fontend/enums';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PickStatisticalTypeComponent } from '../../component/pick-statistical-type/pick-statistical-type.component';
import { stakedChart, Statistical } from '@minhdu-fontend/data-models';
import { StatisticalAgencyService } from '../../service/statistical/statistical-Agency.service';
import { StatisticalChickenService } from '../../service/statistical/statistical-chicken.service';
import { StatisticalProvinceService } from '../../service/statistical/statistical-province.service';
import { StatisticalCustomerService } from '../../service/statistical/statistical-customer.service';
import { getMonth } from 'ngx-bootstrap/chronos';
import { AgencyPrintService } from '../../service/statistical_print/agency-print.service';
import { ChickenPrintService } from '../../service/statistical_print/chicken-print.service';
import { ProvincePrintService } from '../../service/statistical_print/province-print.service';
import { CustomerPrintService } from '../../service/statistical_print/customer-print.service';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';


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
  CurrentMonth = getMonth(new Date()) + 1;
  statisticalCommodityDetail: stakedChart[] = [];
  statisticalDebt: stakedChart[] = [];
  statisticalChicken: Statistical[] = [];
  statisticalYType = StatisticalYType;
  statisticalXType = StatisticalXType;
  formGroup!: FormGroup;
  dateTime = DatetimeUnitEnum;
  labelY!: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly statisticalAgencyService: StatisticalAgencyService,
    private readonly agencyPrintService: AgencyPrintService,
    private readonly statisticalChickenService: StatisticalChickenService,
    private readonly chickenPrintService: ChickenPrintService,
    private readonly statisticalProvinceService: StatisticalProvinceService,
    private readonly provincePrintService: ProvincePrintService,
    private readonly statisticalCustomerService: StatisticalCustomerService,
    private readonly customerPrintService: CustomerPrintService
  ) {
  }

  ngOnInit() {
    this.statisticalProvinceService.getAll({
      type: this.statisticalYType.ORDER,
      startedAt: new Date(this.date.getFullYear(), this.date.getMonth(), 1),
      endedAt: new Date()
    }).subscribe(val => {
        val.forEach(value => {
          value.series.forEach(item => this.totalOrders = this.totalOrders + item.value);
        });
      }
    );
    this.statisticalCustomer({ type: this.statisticalYType.POTENTIAL });
    this.statisticalCustomer({ type: this.statisticalYType.COMMODITY_DETAIL });
    this.statisticalCustomer({ type: this.statisticalYType.DEBT });
    const btnOrder = document.getElementById('home');
    btnOrder?.classList.add('btn-border');
    this.formGroup = this.formBuilder.group({
      type: [Validators.required],
      startedAt: [Validators.required],
      endedAt: [Validators.required]
    });
  }

  onStatistical(type: StatisticalXType) {
    const ref = this.dialog.open(PickStatisticalTypeComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
        if (val) {
            switch (type) {
              case this.statisticalXType.AGENCY:
                this.statisticalAgencyService.getAll(val).subscribe(value => {
                  if (val) {
                    this.statisticalAgency = value;
                  }
                });
                if(val.print){
                  this.agencyPrintService.getAll(val).subscribe();
                }
                break;
              case this.statisticalXType.CHICKEN_TYPE:
                this.statisticalChickenService.getAll(val).subscribe(value => {
                  if (val) {
                    this.statisticalChicken = value;
                  }
                });
                if(val.print){
                  this.chickenPrintService.getAll(val).subscribe();
                }
                break;
              default:
                this.statisticalProvinceService.getAll(val).subscribe(value => {
                  if (value) {
                    this.statisticalProvince = value;
                  }
                });
                if(val.print){
                  this.provincePrintService.getAll(val).subscribe();
                }
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
    );
  }

  printCustomer(type:StatisticalYType ){
    this.dialog.open(DevelopmentComponent, {width: '30%'})
    // this.customerPrintService.getAll(type).subscribe();
  }
  statisticalCustomer(param: any) {
    this.statisticalCustomerService.getAll(param).subscribe(value => {
      if (value) {
        switch (param.type) {
          case this.statisticalYType.POTENTIAL:
            this.statisticalPotential = value;
            this.statisticalPotential.forEach(val => {
              this.TotalPotential = this.TotalPotential + val.series[0].value;
            });
            break;
          case this.statisticalYType.COMMODITY_DETAIL:
            this.statisticalCommodityDetail = value;
            break;
          case this.statisticalYType.DEBT:
            this.statisticalDebt = value;
            break;
        }
      }
    });
  }
}
