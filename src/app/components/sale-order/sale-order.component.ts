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

@Component({
  selector: 'app-sale-order',
  standalone: true,
  imports: [SearchComponent, SaleOrderFormComponent],
  templateUrl: './sale-order.component.html',
  styleUrl: './sale-order.component.css',
})
export class SaleOrderComponent {
  // @ViewChild(SearchComponent) search_component!: SearchComponent<Partner>;

  constructor(
    public partner_service: PartnerService,
    private search_service: SearchService,
    public sale_order_service: SaleOrderService
  ) {}

  // ngAfterViewInit(): void {
  //   this.search_service.register(
  //     this.search_component,
  //     this.partner_service.db
  //   );
  // }
}
