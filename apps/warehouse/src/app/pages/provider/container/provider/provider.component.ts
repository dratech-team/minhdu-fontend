import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { debounceTime } from 'rxjs/operators';
import { ProviderEntity } from '../../entities';
import { ProviderActions, ProviderQuery } from '../../state';
import { DialogProviderComponent } from '../../components/dialog-provider/dialog-provider.component';
import { Actions } from '@datorama/akita-ng-effects';
import { SearchProviderDto } from '../../dto/search-provider.dto';

@Component({
  templateUrl: 'provider.component.html'
})
export class ProviderComponent implements OnInit {
  provider$ = this.providerQuery.selectAll();
  formGroup = new FormGroup({
    search: new FormControl(),
    startedAt: new FormControl(),
    endedAt: new FormControl()
  });
  total$ = this.providerQuery.selectCount();
  loading$ = this.providerQuery.select(state => state.loading);

  constructor(
    private readonly actions$: Actions,
    public readonly providerQuery: ProviderQuery,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(ProviderActions.loadAll({ take: 30, skip: 0 }));
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(val => {
      this.actions$.dispatch(ProviderActions.loadAll(this.mapProvider(false) ));
    });
  }

  addProvider() {
    this.dialog.open(DialogProviderComponent, {
      width: 'fit-content'
    });
  }

  updateProvider(provider: ProviderEntity) {
    this.dialog.open(DialogProviderComponent, {
      width: 'fit-content',
      data: {
        provider: provider,
        isUpdate: true
      }
    });
  }

  deleteProvider(provider: ProviderEntity) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá nhà cung cấp',
        description: `bạn có muốn xoá nhà cung cấp ${provider.name}`
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.actions$.dispatch(ProviderActions.remove({ id: provider.id }));
        }
      });
  }

  mapProvider(isScroll: boolean) {
    const value = this.formGroup.value;
    return {
      take: 30,
      skip: isScroll ? this.providerQuery.getCount() : 0,
      search: {
        name: value?.name,
      }
    } as SearchProviderDto;
  }

  onScroll() {
    this.actions$.dispatch(ProviderActions.loadAll(this.mapProvider(true)));
  }
}
