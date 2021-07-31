import { Component, OnInit } from '@angular/core';
import { DatetimeUnitEnum, StatisticalXType, StatisticalYType } from '@minhdu-fontend/enums';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PickStatisticalTypeComponent } from '../../component/pick-statistical-type/pick-statistical-type.component';
import { Statistical } from '@minhdu-fontend/data-models';
import { StatisticalAgencyService } from '../../service/statistical-Agency.service';
import { StatisticalChickenService } from '../../service/statistical-chicken.service';
import { StatisticalProvinceService } from '../../service/statistical-province.service';

@Component({
  templateUrl: 'statistical.component.html'
})
export class StatisticalComponent implements OnInit {
  statisticalProvince: Statistical[] = [];
  statisticalAgency: Statistical[] = [];
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
    private readonly statisticalChickenService: StatisticalChickenService,
    private readonly statisticalProvinceService: StatisticalProvinceService
  ) {
  }

  ngOnInit() {
    const btnOrder = document.getElementById('home')
    btnOrder?.classList.add('btn-border')
    this.formGroup = this.formBuilder.group({
      type: [Validators.required],
      startedAt: [Validators.required],
      endedAt: [Validators.required]
    });
  }

  onStatistical(type: StatisticalXType) {
    const ref = this.dialog.open(PickStatisticalTypeComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      console.log(val)
        if (val) {
          switch (type) {
            case this.statisticalXType.AGENCY:
              this.statisticalAgencyService.getAll(val).subscribe(value => {
                this.statisticalAgency = value;
              });
              break;
            case this.statisticalXType.CHICKEN_TYPE:
              this.statisticalChickenService.getAll(val).subscribe(value => {
                this.statisticalChicken = value;
              });
              break;
            default:
              this.statisticalProvinceService.getAll(val).subscribe(value => {
                this.statisticalProvince = value;
              });
          }
          switch (val.type) {
            case this.statisticalYType.CUSTOMER:
              this.labelY = 'Khách hàng';
              break;
            case this.statisticalYType.REVENUE:
              this.labelY = 'Doanh thu';
              break;
            default:
              this.labelY = 'Đơn hàng';
          }
        }
      }
    );
  }
}
