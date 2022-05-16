import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'setting-rank.component.html'
})
export class SettingRankComponent implements OnInit {
  formGroup = new FormGroup({
    from: new FormControl(''),
    to: new FormControl(''),
    rating: new FormControl(''),
  });
  pageSize = 10


  constructor(
    private readonly router: Router

  ) {
  }

  ngOnInit() {
    this.formGroup.get('rating')?.valueChanges.subscribe(val =>
      this.formGroup.get('rating')?.setValue(val.toUpperCase(), {emitEvent: false})
    )
  }

  onSubmit(): any {

  };

  onCancel() {
    this.router.navigate(['xep-hang']).then()
  }
}
