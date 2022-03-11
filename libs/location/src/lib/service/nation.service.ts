import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {Nation} from '@minhdu-fontend/data-models';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class NationService extends BaseService<Nation> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.LOCATION.NATION, http);
  }

  getAll(): Observable<Nation[]> {
    return super.getAll();
  }

  getOne(id: any): Observable<Nation> {
    return super.getOne(id);
  }
}
