import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

export enum GLOBAL_ROUTES {
  partner_load = 'partner/load',
  product_load = 'product/load',
  sale_order = 'sale-order/new',
  sale_order_list = 'sale-order',
  configuration = 'configuration',
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  partner_load() {
    this.go_to(GLOBAL_ROUTES.partner_load);
  }

  product_load() {
    this.go_to(GLOBAL_ROUTES.product_load);
  }

  sale_order() {
    this.go_to(GLOBAL_ROUTES.sale_order);
  }

  go_to(
    route: GLOBAL_ROUTES,
    options: NavigationExtras | undefined = undefined
  ) {
    this.router.navigate([route], options);
  }

  go_back() {
    this.router.navigate(['../']);
  }
}
