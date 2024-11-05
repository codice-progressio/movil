import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ViewChild,
} from '@angular/core';
import { PartnerService } from '../../services/partner.service';
import { Partner } from '../../models/partner.model';
import { SearchComponent } from '../generic/search/search.component';
import {
  SearchRegisterComponent,
  SearchService,
} from '../generic/search.service';
import { SaleOrderFormComponent } from './sale-order-form/sale-order-form.component';
import { SaleOrderService } from '../../services/sale-order.service';
import { SaleOrderListComponent } from './sale-order-list/sale-order-list.component';
import { NavigationEnd, Router } from '@angular/router';
import { GLOBAL_ROUTES } from '../../services/navigation.service';

@Component({
  selector: 'app-sale-order',
  standalone: true,
  imports: [SearchComponent, SaleOrderFormComponent, SaleOrderListComponent],
  templateUrl: './sale-order.component.html',
  styleUrl: './sale-order.component.css',
})
export class SaleOrderComponent {
  constructor(
    public partner_service: PartnerService,
    public sale_order_service: SaleOrderService,
    public router: Router
  ) {
    // Detect the route to change betwenn components
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.show_list_view =  '/'+GLOBAL_ROUTES.sale_order_list == val.url
      }
    });
  }

  show_list_view = true;


}
