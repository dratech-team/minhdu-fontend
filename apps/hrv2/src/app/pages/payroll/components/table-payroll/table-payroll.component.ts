import {Component, Input, OnInit} from "@angular/core";
import {PayrollEntity} from "../../entities";
import {FormGroup} from "@angular/forms";
import {checkInputNumber} from "@minhdu-fontend/utils";
import {PositionQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/position/state";
import {BranchQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/branch/state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollStore} from "../../state";
import {ItemContextMenu} from "@minhdu-fontend/enums";

@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html'
})
export class TablePayrollComponent implements OnInit {
  @Input() payrolls!: PayrollEntity[]
  @Input() formGroup!: FormGroup
  @Input() pageSize = 10;
  @Input() scroll: { x: string, y: string } = {x: '3000px', y: '56vh'}
  positions$ = this.positionQuery.selectAll()
  ItemContextMenu = ItemContextMenu;

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1 == o2.type : o1.type === o2.type);

  constructor(
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly payrollStore: PayrollStore,
    private readonly actions$: Actions,
  ) {
  }

  ngOnInit() {
    console.log(this.payrolls)
  }

  onPagination(index: number) {
  }

  onAdd($event: any) {

  }

  onDelete($event: any) {

  }

  onUpdate($event: any) {
  }

  onRestore($event: any) {

  }

  onHistory($event: any) {

  }

  onConfirm($event: any) {

  }

  onPrint($event: any) {

  }
}
