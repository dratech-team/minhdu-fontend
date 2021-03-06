import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@minhdu-fontend/service';
import { ResponseMessageEntity } from '@minhdu-fontend/base-entity';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Actions } from '@datorama/akita-ng-effects';
import { SalaryEntity } from '../entities';

//chưa sử dụng, sử dụng cho trường hợp khi tạo store cho salary
export class SalaryService extends BaseService<SalaryEntity> {
  constructor(
    public readonly message: NzMessageService,
    public readonly actions$: Actions,
    public readonly url: string,
    public readonly http: HttpClient
  ) {
    super(url, http);
  }

  addMany(body: any): Observable<ResponseMessageEntity> {
    return super.addMany(body);
  }

  updateMany(
    body: any,
    method?: 'put' | 'patch' | 'post'
  ): Observable<ResponseMessageEntity> {
    return super.updateMany(body, method);
  }

  deleteMany(body: number[]): Observable<ResponseMessageEntity> {
    return super.deleteMany(body);
  }
}
