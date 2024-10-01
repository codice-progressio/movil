import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum Routes {
  partner_load = 'partner/load',
  sale_order = 'sale-order',
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  partner_load() {
    this.go_to(Routes.partner_load);
  }

  sale_order() {
    this.go_to(Routes.sale_order);
  }

  go_to(route: Routes) {
    this.router.navigate([route]);
  }

  go_back() {
    this.router.navigate(['../']);
  }
}
