import { Routes } from '@angular/router';
import { SaleOrderComponent } from './components/sale-order/sale-order.component';
import { PartnerLoadComponent } from './components/partner-load/partner-load.component';

export const routes: Routes = [
  { path: 'partner/load', component: PartnerLoadComponent },
  { path: 'sale-order', component: SaleOrderComponent },
  { path: '', redirectTo: '/sale-order', pathMatch: 'full' },
];
