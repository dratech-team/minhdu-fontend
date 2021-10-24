import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const searchAutocomplete = (name$: Observable<string>, data$: Observable<any[]>) => {
  return combineLatest([
    name$,
    data$
  ]).pipe(
    map(([name, data]) => {
      if (name) {
        return data.filter((e) => {
          return (e?.name || e?.title).toLowerCase().includes(name?.toLowerCase());
        });
      } else {
        return data;
      }
    })
  );
};

export const searchAndAddAutocomplete = (name$: Observable<string>, data$: Observable<any[]>) => {
  return combineLatest([
    name$,
    data$
  ]).pipe(
    map(([name, Data]) => {
      if (name) {
        const result = Data.filter((e) => {
          return e.name.toLowerCase().includes(name?.toLowerCase());
        });
        if (result.length === 0) {
          result.push({ id: 0, name: 'Tạo mới' });
        }
        return result;
      } else {
        return Data;
      }
    })
  );
};
