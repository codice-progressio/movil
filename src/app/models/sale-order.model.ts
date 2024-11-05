import { SearchValues } from '../components/generic/search.service';

export enum SaleOrderStates {
  DRAFT = 'BORRADOR',
  CONFIRMED = 'CONFIRMADO',
  DONE = 'HECHO',
  CANCEL = 'CANCELADO',
}

export enum SaleOrderEnum {
  _id = '_id',
  partner_id = 'partner_id',
  partner_name = 'partner_name',
  partner_lastname = 'partner_lastname',
  partner_home = 'partner_home',
  date_order = 'date_order',
  amount_total = 'amount_total',
  state = 'state',
  lines = 'lines',
}

export interface SaleOrder extends PouchDB.Core.PutDocument<{}>, SearchValues {
  _id: string;
  partner_id: string;
  partner_name: string;
  partner_lastname: string;
  partner_home: string;
  date_order: string;
  amount_total: number;
  state: SaleOrderStates;
  lines: SaleOrderLine[];
}

export interface SaleOrderLine {
  product_id: string;
  product: string;
  price_unit: number;
  quantity: number;
  amount_total: number;
  sale_order_id: string;
}
