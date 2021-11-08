import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

export const getState = (selected: any, store: Store) => {

  let state!: any;
  store.select(selected).pipe(take(1)).subscribe(
    s => state = s
  );
  return state;
};
