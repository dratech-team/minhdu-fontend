import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Medicine } from '../+state/medicine.interface';

@Injectable({ providedIn: 'root' })
export class MedicineService extends BaseService<Medicine> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.MEDICINE, http);
  }

  addOne(props: Medicine): Observable<Medicine> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<Medicine>> {
    return super.pagination(params);
  }

  Pagination(params: any): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.url, { params });
  }

  getOne(id: any): Observable<Medicine> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<UpdateNum<Medicine>> {
    return super.update(id, body);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
