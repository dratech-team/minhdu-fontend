import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";

@Component({
  templateUrl: 'classify-overtime.component.html'
})
export class ClassifyOvertimeComponent implements OnInit{
  formControl = new FormControl('')
  constructor(
    private readonly dialogRef: MatDialogRef<ClassifyOvertimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[] = []
  ) {
  }
  ngOnInit() {
    console.log(this.data)
  }

  onClose(){
    this.dialogRef.close()
  }
}
