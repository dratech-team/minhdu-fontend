import { Injectable } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountActions } from './account.actions';
import { AccountStore } from './account.store';
import { SearchAccountDto } from '../../dto/account/search-account.dto';
import { AddAccountDto } from '../../dto/account/add-account.dto';
import { RemoveAccountDto } from '../../dto/account/remove-account.dto';
import { PaginationDto } from '@minhdu-fontend/constants';
import { AccountQuery } from './account.query';
import { Router } from '@angular/router';
import { SignInDto } from '../../dto/account/sign-in.dto';
import { AccountEntity } from '../../entities/account.entity';

@Injectable()
export class AccountEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly accountService: AccountService,
    private readonly message: NzMessageService,
    private readonly accountStore: AccountStore,
    private readonly accountQuery: AccountQuery,
    private readonly router: Router
  ) {
  }

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(AccountActions.addOne),
    switchMap((props: AddAccountDto) => {
      this.accountStore.update(state => ({
        ...state, added: false
      }));
      return this.accountService.signUp(props).pipe(
        tap(res => {
          this.message.success('Thêm tài khoản thành công');
          this.accountStore.update(state => ({
            ...state, added: true
          }));
          this.accountStore.add(res);
        }),
        catchError(err => {
          this.accountStore.update(state => ({
            ...state, added: null
          }));
          return of(AccountActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(AccountActions.loadAll),
    switchMap((props: SearchAccountDto) => {
      this.accountStore.update(state => (
        Object.assign({ ...state }, props.isPaginate
          ? { loadMore: true }
          : { loading: true }
        )
      ));
      Object.assign(props.search, {
        take: PaginationDto.take,
        skip: props.isPaginate ? this.accountQuery.getCount() : PaginationDto.skip
      });
      return this.accountService.pagination(props).pipe(
        map((res) => {
          this.accountStore.update(state => (
            Object.assign({ ...state, total: res.total }, props.isPaginate
              ? { loadMore: false }
              : { loading: false }
            )
          ));
          if (props.isPaginate) {
            this.accountStore.add(res.data);
          } else {
            this.accountStore.upsertMany(res.data);
          }
        }),
        catchError((err) => {
          this.accountStore.update(state => (
            Object.assign({ ...state }, props.isPaginate
              ? { loadMore: false }
              : { loading: false }
            )
          ));
          return of(AccountActions.error(err));
        })
      );
    })
  );


  @Effect()
  loadOne$ = this.actions$.pipe(
    ofType(AccountActions.loadOne),
    switchMap((props) => {
        return this.accountService.getOne(props).pipe(
          map((res) => {
            this.message.success('Tải tài khoản thành công');
            this.accountStore.upsert(res.id, res);
          }),
          catchError((err) => {
            return of(AccountActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  signIn$ = this.actions$.pipe(
    ofType(AccountActions.signIn),
    switchMap((props: SignInDto) => {
        this.accountStore.update(state => ({
          ...state, loginning: true
        }));

        return this.accountService.signIn(props).pipe(
          tap((user: AccountEntity) => {
            this.accountStore.update(state => ({ ...state, loginning: false, active: user.id }));
            this.accountStore.add(user);
            this.message.success('Đăng nhập thành công');
            this.router.navigate(['/']).then();
          }),
          catchError((err) => {
            this.accountStore.update(state => ({
              ...state, loginning: false
            }));
            return of(AccountActions.error(err));
          })
        );
      }
    )
  );


  @Effect()
  update$ = this.actions$.pipe(
    ofType(AccountActions.update),
    switchMap((props) => {
        this.accountStore.update(state => ({
          ...state, added: false
        }));
        return this.accountService.update(props).pipe(
          map((res) => {
            this.accountStore.update(state => ({
              ...state, added: true
            }));
            this.message.success('Cập nhật tài khoản thành công');
            this.accountStore.update(res.id, res);
          }),
          catchError((err) => {
            this.accountStore.update(state => ({
              ...state, added: true
            }));
            return of(AccountActions.error(err));
          })
        );
      }
    )
  );


  @Effect()
  remove$ = this.actions$.pipe(
    ofType(AccountActions.remove),
    switchMap((props: RemoveAccountDto) => {
        this.accountStore.update(state => ({
          ...state, deleted: false
        }));
        return this.accountService.delete(props.id).pipe(
          map((_) => {
            this.accountStore.update(state => ({
              ...state, deleted: true
            }));
            this.message.success('Xoá tài khoản thành công');
            this.accountStore.remove(props.id);
          }),
          catchError((err) => {
            this.accountStore.update(state => ({
              ...state, deleted: null
            }));
            return of(AccountActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  logOut$ = this.actions$.pipe(
    ofType(AccountActions.logout),
    switchMap((props) => {
        this.accountStore.update(state => ({ ...state, active: null }));
        this.accountStore.remove(props.id);
        return this.router.navigate(['auth/login']).then();
      }
    )
  );
}


