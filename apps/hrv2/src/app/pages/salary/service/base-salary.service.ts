import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseService} from "@minhdu-fontend/service";
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
import {map, tap} from "rxjs/operators";
import {PayrollActions} from "../../payroll/state/payroll.action";
import {NzMessageService} from "ng-zorro-antd/message";
import {Actions} from "@datorama/akita-ng-effects";

export class BaseSalaryService<T> extends BaseService<T> {
  constructor(
    public readonly message: NzMessageService,
    public readonly actions$: Actions,
    public readonly url: string,
    public readonly http: HttpClient
  ) {
    super(url, http)
  }

  addMany(body: any, addOne?: { payrollId: number }): Observable<ResponseMessageEntity> {
    return super.addMany(body).pipe(
      tap(res => {
        this.message.success(res.message)
        if (addOne){
          this.actions$.dispatch(PayrollActions.loadOne({
            id: addOne.payrollId
          }))
        }
      })
    );
    ;
  }

  updateMany(body: any, updateOne?: { payrollId: number }): Observable<ResponseMessageEntity> {
    return super.updateMany(body).pipe(
      tap(res => {
        this.message.success(res.message)
        if (updateOne){
          this.actions$.dispatch(PayrollActions.loadOne({
            id: updateOne.payrollId
          }))
        }
      })
    );
  }


  deleteMany(body: number[]): Observable<ResponseMessageEntity> {
    return super.deleteMany(body);
  }

}
