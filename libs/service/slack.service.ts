import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../constants';


@Injectable({ providedIn: 'root' })
export class SlackService {

  constructor(
    public readonly http: HttpClient
  ) {
  }

  sendErr(err: string): Observable<any> {
    return this.http.post<any>(Api.SLACK_WEBHOOK,
      {
        username: 'Bug Report',
        text: 'Long bug',
        icon_emoji: ':ladybug:'
      });
  }
}
