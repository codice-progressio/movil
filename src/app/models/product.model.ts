export interface Product extends PouchDB.Core.PutDocument<{}> {
  name: string;
  description: string;
  price: number;
}
