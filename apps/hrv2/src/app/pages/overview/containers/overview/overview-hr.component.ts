import {Component} from '@angular/core';
import {OverviewService} from '../../service/overview.service';
import {OverviewFilterEnum} from '@minhdu-fontend/enums';
import {NzModalService} from "ng-zorro-antd/modal";
import {
  StatisticalEmployeeComponent
} from "../../components/dialog-statistical-employee/statistical-employee.component";

@Component({
  templateUrl: 'overview.component.html'
})
export class OverviewHrComponent  {
  overviewAgeEmployee$ = this.overviewService.overviewAge({ filter: OverviewFilterEnum.AGE })
  overviewTotalEmployee$ = this.overviewService.overviewTotalEmp({ filter: OverviewFilterEnum.CREATED_AT })

  constructor(
    private readonly modal: NzModalService,
    private readonly overviewService: OverviewService
  ) {
  }


  statisticalEmployee() {
    this.modal.create({
      nzWidth:'20vw',
      nzTitle:'Lọc biểu đồ',
      nzContent: StatisticalEmployeeComponent,
      nzFooter: []
    })
  }
}
