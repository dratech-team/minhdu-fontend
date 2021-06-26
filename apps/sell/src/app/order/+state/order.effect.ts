import { Actions } from '@datorama/akita-ng-effects';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderEffect {
  constructor(private actions$: Actions) {
  }
}
