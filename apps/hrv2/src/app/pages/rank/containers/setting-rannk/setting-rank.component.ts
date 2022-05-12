import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  templateUrl: 'setting-rank.component.html'
})
export class SettingRankComponent implements OnInit, AfterViewChecked {
  formGroup = new FormGroup({
    from: new FormControl(''),
    to: new FormControl(''),
    rating: new FormControl(''),
  });
  pageSize = 10


  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
  }

  onSubmit(): any {

  };
}
