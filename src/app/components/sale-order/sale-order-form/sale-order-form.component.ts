import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SaleOrderService } from '../../../services/sale-order.service';
import { SearchComponent } from '../../generic/search/search.component';
import { ProductsService } from '../../../services/products.service';
import { SaleOrderStates } from '../../../models/sale-order.model';
import { ConfigurationService } from '../../../services/configuration.service';

@Component({
  selector: 'app-sale-order-form',
  standalone: true,
  imports: [CurrencyPipe, FontAwesomeModule, CommonModule, SearchComponent],
  templateUrl: './sale-order-form.component.html',
  styleUrl: './sale-order-form.component.css',
})
export class SaleOrderFormComponent {
  total_lines = 0;
  constructor(
    public sale_order_service: SaleOrderService,
    public product_service: ProductsService, 
    public configuration_service: ConfigurationService
  ) {
    effect(() => {
      const sale_order = this.sale_order_service.buffer_open_draft();
      const lines = sale_order.lines.length;
      if (lines != this.total_lines) this.trigger_special_actions();
      this.total_lines = lines;
      this.state = sale_order.state;
    });
  }

  SALE_ORDER_STATES = SaleOrderStates;

  state: SaleOrderStates = SaleOrderStates.DRAFT;

  @ViewChildren('element')
  elements!: QueryList<ElementRef>;

  selected_index: number = 0;
  selected_sing = true;

  trigger_special_actions() {
    setTimeout(() => {
      this.elements.forEach((element, index) => {
        const nativeElement = element.nativeElement as HTMLAnchorElement;
        nativeElement.classList.remove('fade-in-down');
        nativeElement.classList.remove('d-none');
        if (index == 0) {
          setTimeout(() => {
            nativeElement.classList.add('fade-in-down');
          }, 10);
        }
      });
    });
  }

  select_element(index: number, sing: boolean) {
    this.selected_sing = sing;
    this.selected_index = index;
    return;
  }

  add_qty(qty: number, index: number, sing: boolean) {
    this.selected_index = index;
    this.selected_sing = sing;
    this.sale_order_service.add_qty(qty, index, sing);
  }

  save() {
    this.sale_order_service.save();
  }
}
