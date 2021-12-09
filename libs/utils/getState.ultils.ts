import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

export const getSelectors = <T>(selector: any, store: Store): T => {
  let state: any;
  store
    .select(selector)
    .pipe(take(1))
    .subscribe((s) => (state = s));
  return state;
};
