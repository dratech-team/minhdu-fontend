import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ContractStore } from './contract.store';
import { ContractQuery } from './contract.query';
import { ContractService } from '../../service/contract.service';
import { ContractActions } from './contract.action';
import { SearchContractDto } from '../../dto/contract/search-contract.dto';
import { PaginationDto } from '@minhdu-fontend/constants';

@Injectable()
export class ContractEffect {
  constructor(
    private readonly action$: Actions,
    private readonly contractStore: ContractStore,
    private readonly contractQuery: ContractQuery,
    private readonly rankService: ContractService,
    private readonly message: NzMessageService
  ) {}

  //Chưa sử dụng, sử dụng khi tạo module quản lý hợp đồng nhân viên và cần get all
  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(ContractActions.loadAll),
    switchMap((props: SearchContractDto) => {
      this.contractStore.update((state) =>
        Object.assign(
          {
            ...state,
          },
          props.isPaginate ? { loadMore: true } : { loading: true }
        )
      );
      Object.assign(props.search, {
        take: PaginationDto.take,
        skip: props.isPaginate
          ? this.contractQuery.getCount()
          : PaginationDto.skip,
      });
      return this.rankService.pagination(props).pipe(
        map((res) => {
          if (res.data.length === 0) {
            this.message.info('Đã lấy hết xếp hạng');
          }
          if (props.isPaginate) {
            this.contractStore.add(res.data);
          } else {
            this.contractStore.set(res.data);
          }
          this.contractStore.update((state) =>
            Object.assign(
              {
                ...state,
                total: res.total,
                remain: res.total - this.contractQuery.getCount(),
              },
              props.isPaginate ? { loadMore: false } : { loading: false }
            )
          );
        }),
        catchError((err) => {
          this.contractStore.update((state) =>
            Object.assign(
              {
                ...state,
              },
              props.isPaginate ? { loadMore: false } : { loading: false }
            )
          );
          return of(ContractActions.error(err));
        })
      );
    })
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(ContractActions.addOne),
    switchMap((props) => {
      this.contractStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.rankService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm xếp hạng thành công');
          this.contractStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.contractStore.add(res);
        }),
        catchError((err) => {
          this.contractStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(ContractActions.error(err));
        })
      );
    })
  );

  //Chưa sử dụng, sử dụng khi tạo module quản lý hợp đồng nhân viên  cần get one
  @Effect()
  loadOne$ = this.action$.pipe(
    ofType(ContractActions.loadOne),
    switchMap((props) =>
      this.rankService.getOne(props).pipe(
        map((res) => this.contractStore.upsert(res.id, res)),
        catchError((err) => of(ContractActions.error(err)))
      )
    )
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(ContractActions.update),
    switchMap((props) => {
      this.contractStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.rankService.update(props).pipe(
        tap((response) => {
          this.contractStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.contractStore.update(response.id, response);
        }),
        catchError((err) => {
          this.contractStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(ContractActions.error(err));
        })
      );
    })
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(ContractActions.remove),
    switchMap((props) => {
      this.contractStore.update((state) => ({
        ...state,
        deleted: false,
      }));
      return this.rankService.delete(props.id).pipe(
        map(() => {
          this.contractStore.update((state) => ({
            ...state,
            deleted: true,
          }));
          this.message.success('Xoá xếp hạng thành công');
          return this.contractStore.remove(props.id);
        }),
        catchError((err) => {
          this.contractStore.update((state) => ({
            ...state,
            deleted: null,
          }));
          return of(ContractActions.error(err));
        })
      );
    })
  );
}
