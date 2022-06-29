import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Category } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';
import { tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseService<Category> {
  constructor(
    public readonly http: HttpClient,
    public readonly message: NzMessageService
  ) {
    super(Api.HR.EMPLOYEE.CATEGORY, http);
  }

  addOne(category: any): Observable<Category> {
    return super
      .addOne(category)
      .pipe(tap((val) => this.message.success('Tạo danh mục thành công')));
  }

  update(id: any, body: any): Observable<Category> {
    return super
      .update(id, body)
      .pipe(tap((val) => this.message.success('Cập nhật mục thành công')));
  }

  getAll(params?: any): Observable<Category[]> {
    return super.getAll(params);
  }

  getOne(id: any): Observable<Category> {
    return super.getOne(id);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

  removeEmployee(id: number, body: any): Observable<any> {
    return this.http.patch<any>(this.url + `/${id}/employee`, body);
  }
}
