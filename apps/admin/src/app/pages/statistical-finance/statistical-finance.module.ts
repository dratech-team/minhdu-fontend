import { NgModule } from '@angular/core';
import { StatisticalFinanceRoutingModule } from './statistical-finance-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StatisticalFinanceComponent } from './container/statistical-finance/statistical-finance.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectComponent } from './container/components/collect.component/collect.component';
import { PayComponent } from './container/components/pay.component/pay.component';
import { DebtsComponent } from './container/components/debt.component/debts.component';
import { LoanComponent } from './container/components/loan.component/loan.component';

@NgModule({
  imports: [
    StatisticalFinanceRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  declarations: [
    StatisticalFinanceComponent,
    CollectComponent,
    PayComponent,
    DebtsComponent,
    LoanComponent,
  ],
  exports: [],
})
export class StatisticalFinanceModule {}
