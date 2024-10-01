import { Injectable } from '@angular/core';
import { Collection } from './crud.collection';
import { SaleOrder } from '../models/sale-order.model';

@Injectable({
  providedIn: 'root',
})
export class SaleOrderService {
  db = new Collection<SaleOrder>('sale_order');

  constructor() {}
}
