import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouteAction } from '../../container/+state/route.action';

@Component({
  templateUrl: 'route-dialog.component.html'
})
export class RouteDialogComponent implements OnInit {
  formGroup!: FormGroup;
  employeeId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [this?.data?.route?.name, Validators.required],
      endedAt: [this?.data?.route?.endedAt, Validators.required],
      startedAt: [this?.data?.route?.startedAt, Validators.required],
      bsx: [this?.data?.route?.bsx, Validators.required],
      latitude: [this?.data?.route?.latitude, Validators.required],
      longitude: [this?.data?.route?.longitude, Validators.required],
      driver: [this?.data?.route?.driver, Validators.required]
    });
  }


  pickEmployees(employeeId: number ) {
    console.log(typeof employeeId)
    this.employeeId = employeeId;
  }

  onSubmit() {
    const val = this.formGroup.value;
    const route = {
      name: val.name,
      endedAt: val.endedAt ? new Date(val.endedAt) : undefined,
      startedAt: val.startedAt ? new Date(val.startedAt) : undefined,
      bsx: val.bsx,
      // latitude: val.latitude? val.latitude:undefined,
      // longitude: val.longitude? val.longitude:undefined,
      driver: val.driver,
      // employeeId: this.employeeId,
    };
    if (this.data) {
      this.store.dispatch(RouteAction.updateRoute({ route: route, id: this.data.id }));
    } else {
      this.store.dispatch(RouteAction.addRoute({ route: route }));
    }
  }
}
