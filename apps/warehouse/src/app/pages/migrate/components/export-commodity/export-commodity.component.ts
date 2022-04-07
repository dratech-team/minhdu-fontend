import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {RadiosStatusImportConstant} from "../../../../../shared/constant";
import {select, Store} from "@ngrx/store";
import {getAllOrgchart} from "@minhdu-fontend/orgchart";

@Component({
  selector: 'minhdu-fontend-consignment-dialog',
  templateUrl:'export-commodity.component.html'
})
export class ExportCommodityComponent {
  formGroup = new FormGroup({
    status: new FormControl(-1),
    search: new FormControl('')
  });
  radios = RadiosStatusImportConstant;
  branches$ = this.store.pipe(select(getAllOrgchart))
  formCtrlBranch= new FormControl('');
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);
  constructor(
    private readonly store: Store
  ) {
  }
}
