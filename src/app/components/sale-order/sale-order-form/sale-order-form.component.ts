import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SaleOrderService } from '../../../services/sale-order.service';
import { SearchComponent } from '../../generic/search/search.component';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-sale-order-form',
  standalone: true,
  imports: [CurrencyPipe, FontAwesomeModule, CommonModule, SearchComponent],
  templateUrl: './sale-order-form.component.html',
  styleUrl: './sale-order-form.component.css',
})
export class SaleOrderFormComponent {
  constructor(
    public sale_order_service: SaleOrderService,
    public product_service: ProductsService
  ) {}
}
