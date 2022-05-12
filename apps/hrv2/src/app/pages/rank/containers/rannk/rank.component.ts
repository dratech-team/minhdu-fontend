import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {Branch, Position} from "@minhdu-fontend/data-models";

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

  constructor() {
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(val => {
      //search
    })
  }

  onPagination(index: number) {
    //pagination
  }
}
