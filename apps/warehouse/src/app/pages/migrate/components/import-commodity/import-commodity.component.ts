import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {RadiosStatusImportConstant} from "../../../../../shared/constant";

@Component({
  selector: 'minhdu-fontend-import-commodity',
  templateUrl:'import-commodity.component.html'
})
export class ImportCommodityComponent {
  formGroup = new FormGroup({
    status: new FormControl(-1),
    search: new FormControl('')
  });
  radios = RadiosStatusImportConstant;

}
