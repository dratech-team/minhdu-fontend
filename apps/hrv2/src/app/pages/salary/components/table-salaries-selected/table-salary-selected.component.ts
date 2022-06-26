import {Component, Input, OnInit} from '@angular/core';
import {SalaryEntity} from "../../entities";
import {UntypedFormGroup} from "@angular/forms";

@Component({
  selector: 'minhdu-fontend-table-salaries-selected',
  templateUrl: 'table-salaries-selected.component.html'
})
export class TableSalarySelectedComponent implements OnInit{
  @Input() formGroup!: UntypedFormGroup
  @Input() salaries: SalaryEntity[] = []
  checked = true
  indeterminate = false;
  salaryIdsSelected = new Set<number>();

  ngOnInit() {
    this.salaries.forEach(item => this.salaryIdsSelected.add(item.id))
  }


  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.salaryIdsSelected.add(id);
    } else {
      this.salaryIdsSelected.delete(id);
    }
    this.formGroup.get('salaryIds')?.setValue(Array.from(this.salaryIdsSelected))
  }


  refreshCheckedStatus(): void {
    this.checked = this.salaries.every(({ id }) => this.salaryIdsSelected.has(id));
    this.indeterminate = this.salaries.some(({ id }) => this.salaryIdsSelected.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.formGroup.get('salaryIds')?.setValue(Array.from(this.salaryIdsSelected))
  }

  onAllChecked(checked: boolean): void {
    this.salaries
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.formGroup.get('salaryIds')?.setValue(Array.from(this.salaryIdsSelected))
  }
}
