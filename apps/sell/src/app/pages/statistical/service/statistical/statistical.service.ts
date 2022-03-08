import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class StatisticalService {
  constructor(
    private readonly message: NzMessageService,
    public readonly http: HttpClient
  ) {
  }

  getAll(url: string, params: any): Observable<any[]> {
    return this.http.get<any[]>(url, { params }).pipe(tap(() => {
      this.message.success('Thống kê thành công');
    }));
  }
}
