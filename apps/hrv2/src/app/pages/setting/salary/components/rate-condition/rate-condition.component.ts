import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ConditionConstant } from '../../constants/condition.constant';
import { RateConditionEntity } from '../../entities/rate-condition.entity';
import { RateConditionService } from '../../services/rate-condition.service';
import { PaginationDto } from '@minhdu-fontend/constants';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ModalRateConditionComponent } from '../modal-rate-condition/modal-rate-condition.component';
import { ModalRateConditionData } from '../../data/modal-rate-condition.data';
import { RateConditionConstant } from '../../constants/rate-condition.constant';

@Component({
  selector: 'minhdu-fontend-table-rate-condition',
  templateUrl: 'rate-condition.component.html',
})
export class RateConditionComponent implements OnInit {
  @Input() rateConditionIdInit?: number;

  rateConditions: RateConditionEntity[] = [];
  conditionConstant = ConditionConstant;
  rateConditionConstant = RateConditionConstant;
  rateConditionControl = new UntypedFormControl('');
  total = 0;
  loading = false;

  formGroupTable = new UntypedFormGroup({
    condition: new UntypedFormControl(''),
    with: new UntypedFormControl(''),
    default: new UntypedFormControl(''),
    type: new UntypedFormControl(''),
  });

  constructor(
    private readonly service: RateConditionService,
    private readonly modal: NzModalService,
    private readonly modalRef: NzModalRef
  ) {}

  ngOnInit() {
    if (this.rateConditionIdInit) {
      this.rateConditionControl.setValue(this.rateConditionIdInit);
    }
    this.onLoad(false);
    this.formGroupTable.valueChanges.subscribe((_) => {
      this.onLoad(false);
    });
  }

  onLoad(loadMore: boolean): any {
    this.loading = true;
    this.service
      .pagination({
        search: this.mapRateCondition(this.formGroupTable.value, loadMore),
      })
      .subscribe((val) => {
        this.loading = false;
        this.total = val.total;
        this.rateConditions = loadMore
          ? this.rateConditions.concat(val.data)
          : val.data;
      });
  }

  onAdd() {
    this.modal
      .create({
        nzTitle: 'Thêm điệu kiện',
        nzContent: ModalRateConditionComponent,
        nzFooter: [],
      })
      .afterClose.subscribe((rateConditionEntity: RateConditionEntity) => {
        if (rateConditionEntity) {
          this.total += 1;
          this.rateConditions = this.rateConditions.concat([
            rateConditionEntity,
          ]);
          this.rateConditionControl.setValue(rateConditionEntity.id);
        }
      });
  }

  onUpdate(rateCondition: RateConditionEntity) {
    this.modal
      .create({
        nzTitle: 'Sửa điệu kiện',
        nzContent: ModalRateConditionComponent,
        nzComponentParams: <{ data?: ModalRateConditionData }>{
          data: {
            update: {
              rateCondition: rateCondition,
            },
          },
        },
        nzFooter: [],
      })
      .afterClose.subscribe((rateConditionEntity: RateConditionEntity) => {
        if (rateConditionEntity) {
          this.rateConditions.map((e, i) => {
            if (e.id === rateConditionEntity.id) {
              this.rateConditions[i] = rateConditionEntity;
            }
          });
        }
      });
  }

  onRemove(rateCondition: RateConditionEntity) {
    this.modal.warning({
      nzTitle: 'Xoá điều kiện',
      nzContent: 'Bạn có chắc chắn muốn xoá điều kiện này không',
      nzOkDanger: true,
      nzOnOk: () => {
        this.service.delete(rateCondition.id).subscribe((_) => {
          this.total -= 1;
          const index = this.rateConditions.findIndex(
            (e) => e.id === rateCondition.id
          );
          this.rateConditions.splice(index, 1);
        });
      },
    });
  }

  private mapRateCondition(dataFG: any, loadMore: boolean) {
    return Object.assign(
      {},
      dataFG,
      loadMore
        ? { take: PaginationDto.take, skip: PaginationDto.skip }
        : { take: PaginationDto.take, skip: this.rateConditions.length }
    );
  }

  onSubmit(cancel: boolean) {
    this.modalRef.close(!cancel ? this.rateConditionControl.value : null);
  }
}
