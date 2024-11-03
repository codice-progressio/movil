import { Routes } from '@angular/router';
import { SaleOrderComponent } from './components/sale-order/sale-order.component';
import { PartnerLoadComponent } from './components/load_data/partner-load/partner-load.component';
import { ProductLoadComponent } from './components/load_data/product-load/product-load.component';
import { GLOBAL_ROUTES } from './services/navigation.service';

export const routes: Routes = [
  { path: GLOBAL_ROUTES.partner_load, component: PartnerLoadComponent },
  { path: GLOBAL_ROUTES.product_load, component: ProductLoadComponent },
  { path: GLOBAL_ROUTES.sale_order, component: SaleOrderComponent },
  { path: '', redirectTo: '/' + GLOBAL_ROUTES.sale_order, pathMatch: 'full' },
  { path: '**', redirectTo: '/' + GLOBAL_ROUTES.sale_order, pathMatch: 'full' },
];
