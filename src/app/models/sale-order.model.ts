import { SearchValues } from '../components/generic/search.service';

export enum SaleOrderStates {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  DONE = 'done',
  CANCEL = 'cancel',
}

export interface SaleOrder extends PouchDB.Core.PutDocument<{}>, SearchValues {
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
