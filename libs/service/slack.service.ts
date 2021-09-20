import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class SlackService {
  constructor(public readonly http: HttpClient) {
  }

  sendErr(err: string): Observable<any> {
    return this.http.post<any>('slack.com/api/chat.postMessage',
      {
        text: err
      });
  }
}
