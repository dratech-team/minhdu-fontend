import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  templateUrl: './breed-layout.component.html',
})
export class BreedLayoutComponent implements OnInit {
  role = localStorage.getItem('role');

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.router.navigate(['/']).then();
  }
  onIncubatorFactory(){
    this.router.navigate(['nha-may-ap']).then()
  }
}
