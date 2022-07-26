import { Component, Input, OnInit } from '@angular/core';
import { BaseSearchOrderDto } from '../../../order/dto';
import { OrderService } from '../../../order/service';
import { PaginationDto } from '@minhdu-fontend/constants';
import { OrderEntity } from '../../../order/enitities';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'md-single-select-order',
  templateUrl: 'select-order.component.html'
})
export class SelectOrderComponent implements OnInit {
  @Input() search?: BaseSearchOrderDto;

  subject = new Subject<boolean>();

  orders: OrderEntity[] = [];

  //state
  loading = true;
  loadMore = false;
  total = 0;
  remaining = 0;

  constructor(private readonly orderService: OrderService) {
  }

  ngOnInit(): void {
    this.orderService.pagination({
      search: { take: PaginationDto.take, skip: PaginationDto.skip, ...this.search },
      isSet: true
    }).pipe(take(1)).subscribe(res => {
      this.loading = false;
      this.total = res.total;
      this.orders.concat(res.data);
      this.remaining = res.total - this.orders.length;
    });
  }

  onLoadMore() {
    this.loadMore = true;
    this.orderService.pagination({
      search: { take: PaginationDto.take, skip: this.orders.length, ...this.search },
      isSet: false
    }).subscribe(res => {
      this.orders.concat(res.data);
      this.remaining = res.total - this.orders.length;
    });
  }

}
