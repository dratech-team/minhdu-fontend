import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {PayrollEntity} from "../../entities";
import {FormGroup} from "@angular/forms";
import {PositionActions, PositionQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/position/state";
import {BranchQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/branch/state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollQuery, PayrollStore} from "../../state";
import {FilterTypeEnum, ItemContextMenu} from "@minhdu-fontend/enums";
import {rageDaysInMonth} from "@minhdu-fontend/utils";
import {AccConfirmConstant, PaidConstant} from "../../constants";

@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html'
})
export class TablePayrollComponent implements OnInit, OnChanges {
  @Input() payrolls!: PayrollEntity[]
  @Input() formGroup!: FormGroup
  @Input() pageSize = 10;
  @Input() scroll: { x: string, y: string } = {x: '4200px', y: '56vh'}

  loading$ = this.payrollQuery.select(state => state.loading)
  positions$ = this.positionQuery.selectAll()
  ItemContextMenu = ItemContextMenu;
  accConfirmConstant = AccConfirmConstant
  paidConstant= PaidConstant
  daysInMonth = rageDaysInMonth(this.payrollQuery.getValue().search.startedAt)
  filterTypeEnum = FilterTypeEnum
  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);


  constructor(
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly actions$: Actions,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.payrolls)

  }

  ngOnInit() {
    this.actions$.dispatch(PositionActions.loadAll({}))
    this.payrollQuery.select(state => state.search.startedAt).subscribe(val => {
      this.daysInMonth = rageDaysInMonth(val)
    })
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
