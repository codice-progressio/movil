import { computed, effect, Injectable, signal } from '@angular/core';
import { Collection } from './crud.collection';
import {
  SaleOrder,
  SaleOrderEnum,
  SaleOrderStates,
} from '../models/sale-order.model';
import { Partner } from '../models/partner.model';
import {
  SearchResults,
  SearchValues,
} from '../components/generic/search.service';
import { Product } from '../models/product.model';
import { LoadDataService } from '../components/load_data/load-data.service';
import { GLOBAL_ROUTES } from './navigation.service';
import { NotificationService } from './notification.service';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class SaleOrderService extends LoadDataService<SaleOrder> {
  override db = new CollectionSaleOrder<SaleOrder>('sale-order');
  override navigate_after_load: GLOBAL_ROUTES = GLOBAL_ROUTES.product_load;

  constructor(
    private noti_service: NotificationService,
    private configuration_service: ConfigurationService
  ) {
    super();
    effect(() => {
      const draft = this.buffer_open_draft();
      this._save_draft_in_localstorage(draft);
    });
  }

  private _load_draft_from_localstorage() {
    const draft = localStorage.getItem('sale_order_draft');
    return draft;
  }

  private _save_draft_in_localstorage(draft: SaleOrder) {
    localStorage.setItem('sale_order_draft', JSON.stringify(draft));
  }

  private _clear_draft_from_localstorage() {
    localStorage.removeItem('sale_order_draft');
  }

  /**
   * A signal that holds the current open draft for a sale order.
   * It initializes with a new draft created by the `new_draft` method.
   */
  buffer_open_draft = signal(this.new_draft());

  /**
   * Signal that indicates whether a partner has been selected.
   * Used to track the selection state of a partner in the sales order context.
   */
  is_partner_selected = signal(false);

  /**
   * Creates a new draft sale order with default values
   *
   * @returns {SaleOrder} A new sale order object initialized with empty values and DRAFT state
   */
  new_draft(): SaleOrder {
    const draft = this._load_draft_from_localstorage();
    if (draft) {
      // This is a workaround to avoid undefined signal
      setTimeout(() => this.is_partner_selected.set(true));
      return JSON.parse(draft) as SaleOrder;
    }

    const sale_order: SaleOrder = {
      _id: this.generate_serial_number(),
      partner_id: '',
      partner_name: '',
      partner_lastname: '',
      partner_home: '',
      date_order: new Date().toISOString(),
      amount_total: 0,
      state: SaleOrderStates.DRAFT,
      lines: [],
    };
    return sale_order;
  }

  generate_serial_number() {
    const consecutive = this.configuration_service.consecutive();
    const prepend = this.configuration_service.serial();

    return `${prepend}/${consecutive.toString().padStart(4, '0')}`;
  }

  /**
   * Updates the current draft sale order with partner information from search results
   *
   * @param result - The search results containing partner information
   * @remarks
   * This method will only process the first partner from the results array if available
   *
   * @example
   * ```typescript
   * const searchResult = {
   *   results: [{
   *     _id: '123',
   *     nombre: 'John',
   *     apellido: 'Doe',
   *     domicilio: '123 Main St'
   *   }]
   * };
   * saleOrderService.partner_select(searchResult);
   * // Updates buffer_open_draft with partner info and sets is_partner_selected to true
   * ```
   *
   * @returns void
   * @throws None - Silently returns if result is undefined or empty
   */
  partner_select(result: SearchResults<Partner> | undefined) {
    if (!result || !result?.results?.length) return;

    const partner = result.results[0];
    this.buffer_open_draft.update((draft) => {
      draft.partner_id = partner._id;
      draft.partner_name = partner.nombre;
      draft.partner_lastname = partner.apellido;
      draft.partner_home = partner.domicilio;
      return JSON.parse(JSON.stringify(draft));
    });
    this.is_partner_selected.set(true);
  }

  /**
   * Clears all partner-related information from the current draft buffer and sets partner selection state to false.
   * This method resets the following partner fields to empty strings:
   * - partner_id
   * - partner_name
   * - partner_lastname
   * - partner_home
   *
   * @example
   * // Clear partner information
   * saleOrderService.partner_clear();
   *
   * // Before:
   * // draft = {
   * //   partner_id: '123',
   * //   partner_name: 'John',
   * //   partner_lastname: 'Doe',
   * //   partner_home: '123 Main St'
   * // }
   *
   * // After:
   * // draft = {
   * //   partner_id: '',
   * //   partner_name: '',
   * //   partner_lastname: '',
   * //   partner_home: ''
   * // }
   * // is_partner_selected = false
   */
  partner_clear() {
    this.buffer_open_draft.update((draft) => {
      draft.partner_id = '';
      draft.partner_name = '';
      draft.partner_lastname = '';
      draft.partner_home = '';
      return draft;
    });

    this.is_partner_selected.set(false);
  }

  /**
   * Adds or updates a product in the sale order draft buffer.
   * If the product already exists in the order, it increases the quantity.
   * If the product is new, it adds a new line to the order.
   *
   * @param result - Search results containing the product to add
   * @param qty - Quantity to add (defaults to 1)
   *
   * @example
   * ```typescript
   * // Adding a new product
   * const searchResult = {
   *   results: [{
   *     _id: '123',
   *     nombre: 'Test Product',
   *     precio: 10.99
   *   }]
   * };
   * product_select(searchResult);
   *
   * // Adding multiple units of a product
   * product_select(searchResult, 5);
   * ```
   *
   * @returns void
   */
  product_select(result: SearchResults<Product> | undefined, qty = 1) {
    if (!result || !result?.results?.length) return;

    const product = result.results[0];
    this.buffer_open_draft.update((draft) => {
      // Check if the product is already in the sale order
      const line = draft.lines.find((line) => line.product_id === product._id);
      if (line) line.quantity += qty;
      else {
        // Add to the beginning of the lines array
        // for better visual representation in the UI
        draft.lines.unshift({
          product_id: product._id,
          product: product.nombre,
          price_unit: product.precio,
          quantity: qty,
          amount_total: product.precio,
          sale_order_id: draft._id ?? '',
        });
      }
      draft = this.calculate_values_for_sale_order(draft);
      return JSON.parse(JSON.stringify(draft));
    });
  }

  add_qty(qty: number, index: number, sing: boolean) {
    this.buffer_open_draft.update((draft) => {
      draft.lines[index].quantity += qty * (sing ? 1 : -1);

      const line = draft.lines[index];
      if (line.quantity <= 0) {
        draft.lines = draft.lines.filter(
          (l) => l.product_id !== line.product_id
        );
      }
      draft = this.calculate_values_for_sale_order(draft);
      return JSON.parse(JSON.stringify(draft));
    });
  }

  /**
   * Processes a numeric value to ensure a specific number of decimal places
   * @param value - The numeric value to process
   * @param decimals - The number of decimal places to fix (default: 2)
   * @returns The processed number with fixed decimal places
   */
  private process_decimals(value: number, decimals = 2) {
    return parseFloat(value.toFixed(decimals));
  }

  /**
   * Calculates the total amounts for a sale order and its lines.
   * Updates the amount_total for each line and the total amount for the entire sale order.
   * All calculations are processed with the defined decimal precision.
   *
   * @param sale_order - The sale order object to calculate values for
   * @returns The updated sale order with calculated values
   *
   * @example
   * ```typescript
   * const saleOrder = {
   *   lines: [
   *     { price_unit: 10.50, quantity: 2, amount_total: 0 },
   *     { price_unit: 25.75, quantity: 1, amount_total: 0 }
   *   ],
   *   amount_total: 0
   * };
   *
   * const result = calculate_values_for_sale_order(saleOrder);
   * // Result:
   * // {
   * //   lines: [
   * //     { price_unit: 10.50, quantity: 2, amount_total: 21.00 },
   * //     { price_unit: 25.75, quantity: 1, amount_total: 25.75 }
   * //   ],
   * //   amount_total: 46.75
   * // }
   * ```
   */
  calculate_values_for_sale_order(sale_order: SaleOrder) {
    sale_order.lines.forEach((line) => {
      const total_line = line.price_unit * line.quantity;
      line.amount_total = this.process_decimals(total_line);
    });

    sale_order.amount_total = sale_order.lines.reduce(
      (total, line) => total + line.amount_total,
      0
    );

    sale_order.amount_total = this.process_decimals(sale_order.amount_total);

    return sale_order;
  }

  /**
   * Saves the current draft sale order to the database.
   * The draft is assigned a new consecutive ID and saved to the database.
   * After saving, the draft is cleared from local storage, and a success notification is displayed.
   *
   * @returns void
   */
  save() {
    const draft = this.buffer_open_draft();
    draft.state = SaleOrderStates.CONFIRMED;
    this.db.create(draft).subscribe(() => {
      this._clear_draft_from_localstorage();
      this.partner_clear();
      this.noti_service.toast(
        'La orden ha sido guardada correctamente'
      );
      this.configuration_service.update_consecutive();
      this.buffer_open_draft.set(this.new_draft());
    });
  }


  
}

class CollectionSaleOrder<T extends SearchValues> extends Collection<T> {
  override search_field(element: T): T {
    const datas = element as unknown as SaleOrder;

    element.search_field = [
      datas[SaleOrderEnum.partner_name],
      datas[SaleOrderEnum.partner_lastname],
      datas[SaleOrderEnum.partner_home],
    ].join(' ');
    return element;
  }

  override display_name(data: T): string[] {
    const datas = data as unknown as SaleOrder;
    return [datas[SaleOrderEnum.partner_name]];
  }
}
