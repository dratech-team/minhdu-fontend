import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {Branch, Position} from "@minhdu-fontend/data-models";
import {AppStore} from "../../../../state/app.store";
import {Router} from "@angular/router";

@Component({
  selector: 'minhdu-fontend-rank',
  templateUrl: 'rank.component.html'
})
export class RankComponent implements OnInit {
  ranks$ = new Observable<any>()
  positions$ = new Observable<Position[]>()
  branches$ = new Observable<Branch[]>()
  formGroup = new FormGroup({
    search: new FormControl(''),
    name: new FormControl(''),
    gender: new FormControl(''),
    position: new FormControl([]),
    branch: new FormControl('')
  });
  pageSize = 10

  constructor(
    private readonly appStore: AppStore,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(val => {
      //search
    })
  }

  onPagination(index: number) {
    //pagination
  }

  onSetting(type : 'BONUS'|'RANK') {
    this.appStore.update(state => ({
      ...state, appName: type === 'BONUS' ? 'Cài đặt thưởng': 'Cài đặt Xếp hạng'
    }))
    this.router.navigate(['xep-hang/' + (type === 'BONUS'? 'cai-dat-thuong': 'cai-dat-xep-hang') ]).then()
  }
}
