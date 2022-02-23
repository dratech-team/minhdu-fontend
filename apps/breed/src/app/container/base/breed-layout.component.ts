import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  templateUrl: './breed-layout.component.html',
  styleUrls: ['./breed-layout.component.scss']
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
}
