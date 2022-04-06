import { Component, Inject, OnInit } from '@angular/core';
import { AdminAction } from '../../../../states/admin.action';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';
import { SalaryPaymentService } from '../service/salary-payment.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'detail-overview.component.html'
})
export class DetailOverviewComponent implements OnInit {
  type = 'MONTH';
  dataDetail: any;
  title!: string;
  pageSize = 30;
  totalSalary: number = 0;

  constructor(
    private readonly store: Store,
    private readonly activatedRoute: ActivatedRoute,
    private readonly salaryPaymentService: SalaryPaymentService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit() {
    this.title = this.data.title;
    this.salaryPaymentService.getOne(this.data.id, this.data.year).subscribe(val => {
      if (val) {
        val.map((item: any) => {
          this.totalSalary = this.totalSalary + item.total;
        });
        this.dataDetail = val;
        console.log(this.totalSalary)
      }
    });
    // this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuWarehouseEum.OVERVIEW }));
    // this.activatedRoute.queryParams.subscribe(val => {
    //   if (val) {
    //     this.year = val.year;
    //     this.title = val.title;
    //     this.salaryPaymentService.getOne(this.getId, val.year).subscribe(val => {
    //       if (val) {
    //         val.map((item: any) => {
    //           this.totalSalary = this.totalSalary + item.total;
    //         });
    //         this.dataDetail = val;
    //         console.log(this.totalSalary)
    //       }
    //     });
    //   }
    // });
  }

  // get getId(): number {
  //   return this.activatedRoute.snapshot.params.id;
  // }
}
