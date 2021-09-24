import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { TemplateSalaryBasic } from '../../+state/teamlate-salary-basic/template-salary-basic';
import { TemplateBasicSalaryService } from '../../service/template-basic-salary.service';
import { TemplateSalaryBasicComponent } from '../../component/template-salary-basic/template-salary-basic.component';
import { debounce, debounceTime } from 'rxjs/operators';


@Component({
  templateUrl: 'salary-basic.component.html'
})
export class SalaryBasicComponent implements OnInit {
  type = SalaryTypeEnum;
  unit = DatetimeUnitEnum;
  salaryBasic!: TemplateSalaryBasic [];
  formGroup = new FormGroup(
    {
      title: new FormControl(''),
      price: new FormControl('')
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly templateSalaryService: TemplateBasicSalaryService,
  ) {
  }

  ngOnInit() {
    this.templateSalaryService.getAll().subscribe(val =>{
      this.salaryBasic = val
    })
  }

  templateBasicSalary(template?: any) {
   const ref = this.dialog.open(TemplateSalaryBasicComponent, {
      width: '40%',
      data: template
    })

  }
//TODO
  deleteBasicSalary($event: any) {
    this.templateSalaryService.delete($event.id).pipe(debounceTime(2000)).subscribe(_ => {

        location.reload()

    })
  }
}
