export interface SaleOrder extends PouchDB.Core.PutDocument<{}> {
  partner_id: string;
  partner: string;
  date_order: string;
  amount_total: number;
  state: string;
}
