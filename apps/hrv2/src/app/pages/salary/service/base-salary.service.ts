import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseService} from "@minhdu-fontend/service";
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
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

  addMany(body: any): Observable<ResponseMessageEntity> {
    return super.addMany(body);
  }

 updateMany(body: any, method?: "put" | "patch" | "post"): Observable<ResponseMessageEntity> {
   return super.updateMany(body, method);
 }


  deleteMany(body: number[]): Observable<ResponseMessageEntity> {
    return super.deleteMany(body);
  }

}
