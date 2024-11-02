import { computed, Injectable, signal } from '@angular/core';
import { Collection } from './crud.collection';
import { SaleOrder, SaleOrderStates } from '../models/sale-order.model';
import { Partner } from '../models/partner.model';
import { SearchResults } from '../components/generic/search.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class SaleOrderService {
  db = new Collection<SaleOrder>('sale_order');

  constructor() {}

  /**
   * A signal that holds the current open draft for a sale order.
   * It initializes with a new draft created by the `new_draft` method.
   */
  buffer_open_draft = signal(this.new_draft());

  is_partner_selected = signal(false);

  new_draft() {
    const sale_order: SaleOrder = {
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

  partner_select(result: SearchResults<Partner> | undefined) {
    if (!result || !result?.results?.length) return;

    const partner = result.results[0];
    this.buffer_open_draft.update((draft) => {
      draft.partner_id = partner._id;
      draft.partner_name = partner.nombre;
      draft.partner_lastname = partner.apellido;
      draft.partner_home = partner.domicilio;
      return draft;
    });
    this.is_partner_selected.set(true);
  }

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

  product_select(result: SearchResults<Product> | undefined) {
    if (!result || !result?.results?.length) return;

    const partner = result.results[0];
    this.buffer_open_draft.update((draft) => {
      // draft.partner_id = partner._id;
      // draft.partner_name = partner.nombre;
      // draft.partner_lastname = partner.apellido;
      // draft.partner_home = partner.domicilio;
      return draft;
    });
  }
}
